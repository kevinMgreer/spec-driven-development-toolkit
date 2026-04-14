Feature: Task Management
  As a registered user
  I want to create, complete, and delete tasks
  So that I can track my work and stay organized

  Background:
    Given I am authenticated as a registered user
    And my task list is empty

  # ─── SMOKE ────────────────────────────────────────────────────────────────
  @smoke @happy-path
  Scenario: Create a new task
    When I create a task with title "Buy groceries"
    Then the task "Buy groceries" should appear in my task list
    And the task should be marked as incomplete

  # ─── HAPPY PATH ───────────────────────────────────────────────────────────
  @happy-path
  Scenario: Complete a task
    Given I have a task "Write unit tests" that is incomplete
    When I mark the task "Write unit tests" as complete
    Then the task "Write unit tests" should be marked as complete

  @happy-path
  Scenario: Delete a task
    Given I have a task "Old reminder" in my task list
    When I delete the task "Old reminder"
    Then the task "Old reminder" should not appear in my task list

  @happy-path
  Scenario: View all tasks
    Given I have the following tasks:
      | title            | status     |
      | Buy groceries    | incomplete |
      | Write unit tests | complete   |
      | Call dentist     | incomplete |
    When I view my task list
    Then I should see 3 tasks
    And 1 task should be marked as complete
    And 2 tasks should be marked as incomplete

  # ─── EDGE CASES ───────────────────────────────────────────────────────────
  @edge-case
  Scenario: Create a task with the maximum allowed title length
    When I create a task with a title that is exactly 255 characters long
    Then the task should be created successfully

  @edge-case
  Scenario: Create multiple tasks with the same title
    When I create a task with title "Meeting prep"
    And I create another task with title "Meeting prep"
    Then I should have 2 tasks named "Meeting prep" in my list

  @edge-case
  Scenario: Toggle a completed task back to incomplete
    Given I have a task "Buy groceries" that is complete
    When I mark the task "Buy groceries" as incomplete
    Then the task "Buy groceries" should be marked as incomplete

  # ─── ERROR CASES ──────────────────────────────────────────────────────────
  @error
  Scenario: Create a task with an empty title
    When I create a task with an empty title
    Then I should see the error "Task title is required"
    And no new task should be added to my list

  @error
  Scenario: Create a task with a title that is too long
    When I create a task with a title that is 256 characters long
    Then I should see the error "Task title must be 255 characters or fewer"
    And no new task should be added to my list

  @error
  Scenario: Delete a task that does not exist
    When I attempt to delete a task with id "nonexistent-id-123"
    Then I should receive a "not found" error

  @error
  Scenario: Access task list when not authenticated
    Given I am not authenticated
    When I attempt to view my task list
    Then I should be denied access
    And I should be prompted to log in
