import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Recognition from "./Recognition";

function getTimeline(label: string) {
  const group = screen.getByRole("heading", { name: label }).closest(".timeline-group");
  if (!group) throw new Error(`Timeline group not found: ${label}`);
  return within(group as HTMLElement);
}

describe("Recognition", () => {
  it("provides the experience section anchor used by the desktop outline", () => {
    render(<Recognition profile={profile} />);

    expect(screen.getByRole("heading", { name: "Experience & recognition" }).closest("section")).toHaveAttribute("id", "experience");
  });

  it("uses the clear primary record headings", () => {
    render(<Recognition profile={profile} />);

    expect(screen.getByRole("heading", { name: "Academic & industry appointments" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Research funding & computing support" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Conference participation & presentations" })).toBeInTheDocument();
  });

  it("expands and collapses appointments independently in the original list", async () => {
    const user = userEvent.setup();
    render(<Recognition profile={profile} />);

    const appointments = getTimeline("Academic & industry appointments");
    const activities = getTimeline("Conference participation & presentations");
    const list = appointments.getByRole("list");
    const button = appointments.getByRole("button", { name: "View 1 more appointment" });

    expect(appointments.getAllByRole("listitem")).toHaveLength(4);
    expect(activities.getAllByRole("listitem")).toHaveLength(4);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", list.id);

    await user.click(button);
    expect(appointments.getAllByRole("listitem")).toHaveLength(5);
    expect(activities.getAllByRole("listitem")).toHaveLength(4);
    expect(appointments.getByRole("list")).toBe(list);
    expect(button).toHaveAccessibleName("Show fewer appointments");
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(appointments.getAllByRole("listitem")).toHaveLength(4);
    expect(button).toHaveAccessibleName("View 1 more appointment");
  });

  it("expands and collapses all activities without affecting appointments", async () => {
    const user = userEvent.setup();
    render(<Recognition profile={profile} />);

    const appointments = getTimeline("Academic & industry appointments");
    const activities = getTimeline("Conference participation & presentations");
    const list = activities.getByRole("list");
    const button = activities.getByRole("button", { name: "View 9 more activities" });

    expect(activities.getAllByRole("listitem")).toHaveLength(4);
    await user.click(button);
    expect(activities.getAllByRole("listitem")).toHaveLength(13);
    expect(appointments.getAllByRole("listitem")).toHaveLength(4);
    expect(activities.getByRole("list")).toBe(list);
    expect(button).toHaveAccessibleName("Show fewer activities");

    await user.click(button);
    expect(activities.getAllByRole("listitem")).toHaveLength(4);
    expect(button).toHaveAccessibleName("View 9 more activities");
  });

  it("uses dynamic singular copy and never adds a funding toggle", () => {
    render(<Recognition profile={{ ...profile, activities: profile.activities.slice(0, 5) }} />);

    expect(getTimeline("Conference participation & presentations").getByRole("button")).toHaveAccessibleName("View 1 more activity");
    const funding = getTimeline("Research funding & computing support");
    expect(funding.getAllByRole("listitem")).toHaveLength(4);
    expect(funding.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses stable unique list ids for all three columns without duplicate DOM ids", () => {
    const { container } = render(<Recognition profile={profile} />);

    expect(getTimeline("Academic & industry appointments").getByRole("list")).toHaveAttribute("id", "recognition-appointments-list");
    expect(getTimeline("Research funding & computing support").getByRole("list")).toHaveAttribute("id", "recognition-funding-list");
    expect(getTimeline("Conference participation & presentations").getByRole("list")).toHaveAttribute("id", "recognition-activities-list");
    const ids = [...container.querySelectorAll("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
