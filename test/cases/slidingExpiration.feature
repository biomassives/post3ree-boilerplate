Feature: Sliding Expiration
  Description

  Scenario Outline: Reg and Sign In a new User without and with checkbox
    Given I have an empty DB
    When I send POST request to register with <email> and <password>
    And I send POST request to login with checkbox: <checkbox> username: <email> and password: <password>
    Then I get a new valid JWT token with an expiration date of <minutes> minutes after the current date on the server

    Examples:
      | minutes | checkbox | email                  | password |
      | 43200   | false    | se-checkbox@false.test | 121212   |
      | 60      | true     | se-checkbox@true.test  | yolo123  |

  Scenario Outline: User with expiration date near the current is visit site without and with checkbox
    Given I have a User with checkbox: <checkbox>
    And I have a token with an expiration date for <oldDelta> minutes the most current date on the server or equal to it
    When I send GET request to the API
    Then I get a new valid JWT token with an expiration date of <newDelta> minutes after the current date on the server

#    delta = expDate - currentDate [in minutes]
    Examples:
      | oldDelta | newDelta | checkbox |
      | 7200     | 43200    | false    |
      | 40       | 60       | true     |

  Scenario: User with expired token without checkbox try to get access to api
    Given I have a User
    And I have the expired token
    When I send GET request to the API
    Then I delete token from local storage
    And I have redirect to Sign In page
