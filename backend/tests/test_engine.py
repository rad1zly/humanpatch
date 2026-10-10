"""Engine tests -- run with MOCK_LLM=1 (conftest sets it)."""
from app.engine.adversary import Adversary
from app.engine.mission import Mission, MissionDirector
from app.engine.scenarios import get_scenario, load_scenarios, scenarios_for_persona
from app.engine.signals import detect_signals
from app.engine.telemetry import patch_level


def test_signals_basic():
    assert "shared_credentials" in detect_signals("kodenyang 448291 ya")
    assert "shared_credentials" in detect_signals("NIK saya 3204115508990002")  # 16-digit NIK
    assert "refusal" in detect_signals("Saya tidak akan memberi kode apapun")
    assert "skepticism" in detect_signals("Emang ini dari kantor pusat?")
    assert "hesitation" in detect_signals("oke", delay_ms=25000)
    assert detect_signals("baik bu") == ["neutral"]


def test_scenarios_load():
    sc = load_scenarios()
    assert len(sc) >= 3
    assert "wa_cs_otp" in sc
    s = get_scenario("wa_cs_otp")
    for key in ("opener", "escalation_ladder", "red_flags", "domain"):
        assert s[key], f"missing {key}"


def test_persona_queue_orders_by_tag():
    persona = {"id": "student", "name": "Dika", "context": "", "tags": ["student"]}
    q = scenarios_for_persona(persona)
    assert q[0]["id"] == "wa_prize_link"  # student-tagged scenario first


def test_mission_full_run_gullible_user():
    persona = {"id": "senior", "name": "Ibu Ratna", "context": "", "tags": ["senior"]}
    m = Mission("wa_cs_otp", persona)
    opener = m.start()
    assert "Bank" in opener["message"]
    # gullible: obeys immediately
    r1 = m.reply("Iya saya di dekat HP", delay_ms=1000)
    r2 = m.reply("Baik, kodenya 448291", delay_ms=2000)
    assert r2["finished"]
    assert r2["outcome"] == "compromised"
    s = m.summary()
    assert s["risky_actions"] >= 1
    assert s["score"] < 50


def test_mission_full_run_skeptic_user():
    persona = {"id": "senior", "name": "Ibu Ratna", "context": "", "tags": ["senior"]}
    m = Mission("wa_cs_otp", persona)
    m.start()
    r1 = m.reply("Emang ini dari kantor pusat? Saya curiga, ini penipuan ya", delay_ms=8000)
    r2 = m.reply("Tidak akan saya berikan kode apapun. Saya akan cek ke kantor bank langsung", delay_ms=5000)
    assert r2["finished"]
    assert r2["outcome"] == "survived"
    s = m.summary()
    assert s["refusals"] >= 1
    assert s["score"] > 60


def test_adversary_adapts_tactic():
    persona = {"id": "student", "name": "Dika", "context": "", "tags": ["student"]}
    adv = Adversary(get_scenario("wa_cs_otp"), persona)
    adv.opener()
    # skeptic question -> good_cop
    r = adv.next("Memangnya Anda siapa? Ini penipuan ya?", delay_ms=0)
    assert r["tactic"] in ("good_cop", "pressure")
    # hard refusal twice -> suspicion rises
    r2 = adv.next("Tidak, saya tidak percaya. Ini penipuan.", delay_ms=0)
    assert r2["suspicion"] > r["suspicion"]


def test_director_and_patch_level():
    persona = {"id": "worker", "name": "Sari", "context": "", "tags": ["worker"]}
    d = MissionDirector(persona)
    m = d.next_mission()
    assert m is not None
    m.start()
    m.reply("kode OTP saya 553211", delay_ms=500)
    d.record(m)
    prof_scores = [r["score"] for r in d.results]
    assert patch_level(prof_scores) in ("TARGET MUDAH", "WASPADA", "HARD TARGET", "PATCHED")


def test_tactic_reason_exposed():
    persona = {"id": "senior", "name": "Ibu Ratna", "context": "", "tags": ["senior"]}
    adv = Adversary(get_scenario("wa_cs_otp"), persona)
    adv.opener()
    r = adv.next("Memangnya Anda siapa?", delay_ms=0)
    assert r.get("tactic_reason")  # reason must always be present (judge-proof)


def test_same_scenario_divergent_paths():
    """Two users, same scenario, different behavior -> different tactics & reasons."""
    persona = {"id": "senior", "name": "Ibu Ratna", "context": "", "tags": ["senior"]}

    a = Adversary(get_scenario("wa_cs_otp"), persona)
    a.opener()
    ra = a.next("Emang ini dari bank? Curiga nih", delay_ms=0)   # skeptic

    b = Adversary(get_scenario("wa_cs_otp"), persona)
    b.opener()
    rb = b.next("Baik, kodenya 889977", delay_ms=1000)           # gullible

    assert ra["tactic"] != rb["tactic"]
    assert ra["tactic_reason"] != rb["tactic_reason"]


def test_indicators_and_next_exercise():
    persona = {"id": "mahasiswa", "name": "Rani", "context": "", "tags": ["mahasiswa"]}
    m = Mission("wa_scholarship", persona)
    m.start()
    m.telemetry.track("risky_click")          # opened link without checking
    m.reply("sudah saya isi NIK dan password emailnya 123456", delay_ms=900)
    s = m.summary()
    assert set(s["indicators"]) == {"verify_source", "under_pressure", "protect_data", "report_threat"}
    assert s["indicators"]["protect_data"] == "Belum teramati"
    assert s["next_exercise"] is not None
