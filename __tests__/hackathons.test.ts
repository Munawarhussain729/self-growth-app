import { isActiveHackathon } from "../src/services/hackathons";

describe("isActiveHackathon", () => {
  test("keeps open and upcoming hackathons", () => {
    expect(isActiveHackathon({ open_state: "open" })).toBe(true);
    expect(isActiveHackathon({ open_state: "upcoming" })).toBe(true);
  });

  test("drops ended and closed hackathons", () => {
    expect(isActiveHackathon({ open_state: "ended" })).toBe(false);
    expect(isActiveHackathon({ open_state: "closed" })).toBe(false);
  });

  test("drops hackathons with no state", () => {
    expect(isActiveHackathon({})).toBe(false);
  });
});
