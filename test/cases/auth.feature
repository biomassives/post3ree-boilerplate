Feature: Auth
  JWT based registration and auth

  Scenario Outline: Valid e-mail registration
    When I send POST request to register with <email> and <password>
    Then I get uuid of new user and I can access new user by id (no password, meta-only)

    Examples:
      | email               | password  |
      | example@example.com | 121212    |
      | test@example.com    | yolo123   |

  Scenario: Busy e-mail registration
    When I call api function register with test@example.com and anypassword
    Then I get error message

  Scenario Outline: Sign In
    Given Registered user with username: <email> and password: <password>
    When I send POST request to login with username: <email> and password: <password>
    Then I get valid JWT token

    Examples:
      | email               | password  |
      | example@example.com | 121212    |
      | test@example.com    | yolo123   |

  Scenario: Logout
    Given Registered user with username: example@example.com and password: 121212
    When I send POST request to login with username: example@example.com and password: 121212
    And I sent GET request to /logout
    Then I get response with flag to deauthenticate user

  Scenario: Get current user
    Given Registered user with username: example@example.com and password: 121212
    When I send POST request to login with username: example@example.com and password: 121212
    Then I can send GET request to get user data by token