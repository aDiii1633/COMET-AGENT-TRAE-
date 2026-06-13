import test from "node:test";
import assert from "node:assert/strict";

import { resultCards, workflowSteps } from "./site-data.ts";

test("workflow covers the full StartupPilot AI agent sequence", () => {
  assert.deepEqual(
    workflowSteps.map((step) => step.name),
    [
      "Research Agent",
      "Strategy Agent",
      "Content Agent",
      "Development Agent",
      "Pitch Agent",
    ]
  );
});

test("every dummy result card ships with visible content", () => {
  assert.ok(resultCards.length >= 5);

  resultCards.forEach((card) => {
    assert.notEqual(card.title.trim(), "");
    assert.notEqual(card.label.trim(), "");
    assert.ok(card.bullets.length >= 3);
  });
});
