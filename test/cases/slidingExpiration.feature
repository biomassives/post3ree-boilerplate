Feature: Sliding Expiration
  Description

  Scenario Outline: Reg and Sign In a new User without and with checkbox
    Given I have an empty DB
    When I send POST request to register with <email> and <password>
    And I send POST request to login with checkbox: <checkbox> username: <email> and password: <password>
    Then I get valid JWT token with an expiration date of <hours> hours after the current date on the server

    Examples:
      | hours | checkbox | email                  | password |
      | 720   | false    | se-checkbox@false.test | 121212   |
      | 1     | true     | se-checkbox@true.test  | yolo123  |

  Scenario: Sign In ??? User with expiration date near the current without checkbox
    Given I have a User
    And I have a token with an expiration date for 5 days the most current date on the server or equal to it
    When I send GET request to the API
    Then I get new valid JWT token with an expiration date of 30 days after the current date on the server

  Scenario: Sign In ??? User with expired token without checkbox
    Given I have a User
    And I have the expired token
    When I send GET request to the API
    Then I delete token from local storage
    And I have redirect to Sign In page
