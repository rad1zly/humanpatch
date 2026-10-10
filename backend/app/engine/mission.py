"""Mission runtime: binds scenario + persona + adversary + telemetry."""
import uuid

from .adversary import Adversary
from .director import generate_scenario
from .scenarios import get_scenario, scenarios_for_persona
from .telemetry import Telemetry


class Mission:
    def __init__(self, scenario_id: str, persona: dict, llm=None, scenario: dict | None = None):
        self.id = str(uuid.uuid4())[:8]
        # generated scenarios arrive as full specs; curated ones by id
        self.scenario = scenario if scenario else get_scenario(scenario_id)
        self.persona = persona
        self.adversary = Adversary(self.scenario, persona, llm=llm)
        self.telemetry = Telemetry(self.scenario["domain"])
        self.finished = False
        self.outcome = None

    def start(self) -> dict:
        self.telemetry.track("mission_start", {"scenario": self.scenario["id"]})
        return self.adversary.opener()

    def reply(self, text: str, delay_ms: int = 0) -> dict:
        if self.finished:
            return {"message": "(misi sudah selesai)", "finished": True}
        res = self.adversary.next(text, delay_ms)
        for s in res["signals"]:
            self.telemetry.track(s)
        # mission ends when attacker wins, gives up, or hits turn cap
        if res["tactic"] in ("success", "give_up") or res["turns"] >= 8:
            self.finished = True
            self.outcome = "compromised" if res["tactic"] == "success" else "survived"
            if getattr(self, "director", None):
                self.director.record(self)
        res["finished"] = self.finished
        res["outcome"] = self.outcome
        return res

    def report(self) -> dict:
        """User chose to report the incident (domain: reporting)."""
        self.telemetry.track("reported", {"channel": "in_app_report"})
        self.finished = True
        self.outcome = "survived_reported"
        if getattr(self, "director", None):
            self.director.record(self)
        return {"finished": True, "outcome": self.outcome}

    def summary(self) -> dict:
        s = self.telemetry.behavior_score()
        return {**s, "scenario": self.scenario["id"], "outcome": self.outcome}


class MissionDirector:
    """Session-level orchestrator: persona -> ordered scenario queue,
    keeps history for cross-mission retest (same weakness, different skin).

    custom_profile: free-form self-description -> Director generates bespoke
    scenarios on the fly (one per next_mission call)."""

    def __init__(self, persona: dict, custom_profile: str | None = None):
        self.persona = persona
        self.custom_profile = custom_profile
        self.queue = [] if custom_profile else scenarios_for_persona(persona)
        self.results = []

    def next_mission(self) -> Mission | None:
        if self.custom_profile:
            # a fresh generated scenario each call — different skin, same person
            from .director import generate_scenario as _gen
            spec = _gen(self.custom_profile)
            return Mission(spec["id"], self.persona, scenario=spec)
        while self.queue:
            scenario = self.queue.pop(0)
            return Mission(scenario["id"], self.persona)
        return None

    def record(self, mission: Mission):
        self.results.append(mission.summary())
