# Requirements Document

## Introduction

This document defines requirements for comprehensive API testing documentation for a FastAPI backend with Supabase authentication. The system includes both public APIs (no authentication) and protected APIs (JWT token required). The documentation will enable developers and QA engineers to manually test all endpoints, understand authentication flows, and potentially automate testing.

## Glossary

- **API_Testing_Documentation**: The comprehensive documentation system that describes how to test all backend APIs
- **Public_API**: An API endpoint that does not require authentication (e.g., GET /api/v1/articles)
- **Protected_API**: An API endpoint that requires a valid JWT token in the Authorization header
- **JWT_Token**: JSON Web Token issued by Supabase Auth for authenticated users
- **Swagger_UI**: FastAPI's interactive API documentation interface at /docs
- **Authentication_Flow**: The process of obtaining and using JWT tokens for protected endpoints
- **Test_Scenario**: A documented test case with request format, expected response, and validation criteria
- **Error_Scenario**: A test case that validates proper error handling (4xx, 5xx responses)
- **Manual_Testing_Guide**: Step-by-step instructions for testing APIs through Swagger UI or other tools
- **Automated_Test_Script**: Optional Python scripts using pytest or similar frameworks for automated API testing
- **Request_Format**: The structure of API request including headers, query parameters, and body
- **Response_Format**: The expected structure of API response including status codes and data schema
- **Test_Data**: Sample data used for testing API endpoints (articles, challenges, user progress)
- **Token_Management**: The process of extracting, storing, and using JWT tokens for authentication
- **DevTools**: Browser Developer Tools used to extract tokens from Local Storage
- **User_Progress_API**: Protected endpoints for tracking article and challenge completion

## Requirements

### Requirement 1: Document Public API Testing

**User Story:** As a developer, I want documentation for testing public APIs, so that I can verify endpoints work without authentication.

#### Acceptance Criteria

1. THE API_Testing_Documentation SHALL list all Public_API endpoints with their HTTP methods and paths
2. FOR EACH Public_API endpoint, THE API_Testing_Documentation SHALL provide the Request_Format including query parameters
3. FOR EACH Public_API endpoint, THE API_Testing_Documentation SHALL provide the expected Response_Format with example data
4. THE API_Testing_Documentation SHALL include Test_Scenario examples for filtering and pagination on list endpoints
5. WHEN testing GET /api/v1/articles, THE Manual_Testing_Guide SHALL demonstrate category and difficulty filters
6. WHEN testing GET /api/v1/challenges, THE Manual_Testing_Guide SHALL demonstrate difficulty and category filters
7. WHEN testing GET /api/v1/playground/models, THE Manual_Testing_Guide SHALL show expected model list structure
8. WHEN testing POST /api/v1/playground/run, THE Manual_Testing_Guide SHALL provide sample prompt requests with different parameters

### Requirement 2: Document Authentication Flow

**User Story:** As a developer, I want clear authentication flow documentation, so that I can obtain and use JWT tokens for protected endpoints.

#### Acceptance Criteria

1. THE Authentication_Flow documentation SHALL describe the complete process from login to token usage
2. THE Authentication_Flow documentation SHALL specify the frontend login URL (http://localhost:3000/login)
3. THE Authentication_Flow documentation SHALL provide step-by-step instructions for extracting JWT_Token from DevTools
4. THE Authentication_Flow documentation SHALL specify the Local Storage key pattern (sb-xxxxx-auth-token)
5. THE Authentication_Flow documentation SHALL explain the token structure including access_token field
6. THE Authentication_Flow documentation SHALL demonstrate how to authorize in Swagger_UI with "Bearer YOUR_ACCESS_TOKEN" format
7. WHEN a JWT_Token expires, THE Authentication_Flow documentation SHALL describe re-authentication steps
8. THE Authentication_Flow documentation SHALL include screenshots or detailed descriptions of DevTools navigation

### Requirement 3: Document Protected API Testing

**User Story:** As a developer, I want documentation for testing protected APIs, so that I can verify authenticated endpoints work correctly.

#### Acceptance Criteria

1. THE API_Testing_Documentation SHALL list all Protected_API endpoints with their HTTP methods and paths
2. FOR EACH Protected_API endpoint, THE API_Testing_Documentation SHALL specify the required Authorization header format
3. WHEN testing GET /api/v1/auth/me, THE Manual_Testing_Guide SHALL show expected user profile response
4. WHEN testing PUT /api/v1/auth/profile, THE Manual_Testing_Guide SHALL provide sample profile update requests
5. WHEN testing GET /api/v1/auth/status, THE Manual_Testing_Guide SHALL show both authenticated and unauthenticated responses
6. WHEN testing User_Progress_API endpoints, THE Manual_Testing_Guide SHALL demonstrate article and challenge completion tracking
7. WHEN testing GET /api/v1/user-progress/stats, THE Manual_Testing_Guide SHALL show expected stats structure with level calculation
8. FOR EACH Protected_API endpoint, THE API_Testing_Documentation SHALL describe the 401 Unauthorized error response when token is missing or invalid

### Requirement 4: Document Error Scenarios

**User Story:** As a QA engineer, I want documentation for error scenarios, so that I can verify proper error handling.

#### Acceptance Criteria

1. THE API_Testing_Documentation SHALL include Error_Scenario test cases for each endpoint
2. WHEN a Protected_API is called without Authorization header, THE Error_Scenario SHALL expect 401 status with "Authorization header missing" message
3. WHEN a Protected_API is called with invalid JWT_Token, THE Error_Scenario SHALL expect 401 status with "Invalid or expired token" message
4. WHEN a Protected_API is called with expired JWT_Token, THE Error_Scenario SHALL expect 401 status with "Invalid or expired token" message
5. WHEN a GET request for non-existent resource is made, THE Error_Scenario SHALL expect 404 status with "not found" message
6. WHEN a POST request with invalid data is made, THE Error_Scenario SHALL expect 422 status with validation error details
7. WHEN a database operation fails, THE Error_Scenario SHALL expect 500 status with descriptive error message
8. FOR EACH Error_Scenario, THE API_Testing_Documentation SHALL provide the exact request that triggers the error

### Requirement 5: Document Request and Response Formats

**User Story:** As a developer, I want detailed request and response format documentation, so that I can understand API contracts.

#### Acceptance Criteria

1. FOR EACH API endpoint, THE API_Testing_Documentation SHALL provide complete Request_Format with all parameters
2. FOR EACH API endpoint, THE API_Testing_Documentation SHALL provide complete Response_Format with field descriptions
3. WHEN an endpoint accepts query parameters, THE Request_Format SHALL specify parameter names, types, and valid values
4. WHEN an endpoint accepts request body, THE Request_Format SHALL provide JSON schema with required and optional fields
5. WHEN an endpoint returns paginated data, THE Response_Format SHALL show pagination metadata structure
6. WHEN an endpoint returns user progress, THE Response_Format SHALL show nested structure with articles and challenges arrays
7. FOR EACH field in Response_Format, THE API_Testing_Documentation SHALL specify the data type and example value
8. THE API_Testing_Documentation SHALL use consistent JSON formatting with proper indentation

### Requirement 6: Provide Test Data Examples

**User Story:** As a developer, I want realistic test data examples, so that I can perform meaningful API tests.

#### Acceptance Criteria

1. THE API_Testing_Documentation SHALL provide Test_Data examples for all POST and PUT endpoints
2. WHEN testing article completion, THE Test_Data SHALL include valid article IDs from the seed data
3. WHEN testing challenge completion, THE Test_Data SHALL include valid challenge IDs and score values
4. WHEN testing profile updates, THE Test_Data SHALL include sample username, display_name, bio, and avatar_url values
5. WHEN testing playground prompts, THE Test_Data SHALL include diverse prompt examples (summarization, code generation, explanation)
6. WHEN testing search functionality, THE Test_Data SHALL include sample search queries with expected results
7. THE Test_Data SHALL include both valid and invalid examples to test validation
8. FOR EACH Test_Data example, THE API_Testing_Documentation SHALL explain what the test validates

### Requirement 7: Document Swagger UI Testing Workflow

**User Story:** As a developer, I want a Swagger UI testing workflow guide, so that I can efficiently test APIs through the interactive interface.

#### Acceptance Criteria

1. THE Manual_Testing_Guide SHALL provide the Swagger_UI URL (http://localhost:8000/docs)
2. THE Manual_Testing_Guide SHALL describe how to navigate Swagger_UI sections by tags
3. THE Manual_Testing_Guide SHALL demonstrate expanding endpoint documentation to view parameters
4. THE Manual_Testing_Guide SHALL show how to use "Try it out" button for testing
5. WHEN testing Public_API endpoints, THE Manual_Testing_Guide SHALL demonstrate testing without authorization
6. WHEN testing Protected_API endpoints, THE Manual_Testing_Guide SHALL demonstrate using the "Authorize" button
7. THE Manual_Testing_Guide SHALL explain how to enter "Bearer YOUR_ACCESS_TOKEN" in the authorization dialog
8. THE Manual_Testing_Guide SHALL describe how to interpret response status codes and bodies in Swagger_UI

### Requirement 8: Document User Progress Testing Flow

**User Story:** As a QA engineer, I want a complete user progress testing flow, so that I can verify the learning tracking system works end-to-end.

#### Acceptance Criteria

1. THE Manual_Testing_Guide SHALL provide a sequential Test_Scenario for user progress tracking
2. THE Test_Scenario SHALL start with GET /api/v1/user-progress to verify initial empty state
3. THE Test_Scenario SHALL demonstrate POST /api/v1/user-progress/article to mark an article completed
4. THE Test_Scenario SHALL demonstrate POST /api/v1/user-progress/challenge to mark a challenge completed with score
5. THE Test_Scenario SHALL demonstrate GET /api/v1/user-progress to verify updated progress with completed items
6. THE Test_Scenario SHALL demonstrate GET /api/v1/user-progress/stats to verify aggregated statistics
7. THE Test_Scenario SHALL verify level calculation changes based on total points (Newcomer, Beginner, Intermediate, Advanced, Expert)
8. THE Test_Scenario SHALL demonstrate idempotency by marking the same article completed twice

### Requirement 9: Provide Optional Automated Test Scripts

**User Story:** As a developer, I want optional automated test scripts, so that I can run regression tests efficiently.

#### Acceptance Criteria

1. WHERE automated testing is desired, THE API_Testing_Documentation SHALL provide Automated_Test_Script examples using pytest
2. WHERE automated testing is desired, THE Automated_Test_Script SHALL demonstrate using TestClient for FastAPI
3. WHERE automated testing is desired, THE Automated_Test_Script SHALL show how to create test JWT tokens for protected endpoints
4. WHERE automated testing is desired, THE Automated_Test_Script SHALL include test cases for both success and error scenarios
5. WHERE automated testing is desired, THE Automated_Test_Script SHALL demonstrate mocking Supabase client for isolated testing
6. WHERE automated testing is desired, THE Automated_Test_Script SHALL show how to run tests with pytest command
7. WHERE automated testing is desired, THE Automated_Test_Script SHALL include fixtures for common test setup (tokens, test data)
8. WHERE automated testing is desired, THE API_Testing_Documentation SHALL reference existing test files in backend/tests/ directory

### Requirement 10: Document Common Testing Issues and Solutions

**User Story:** As a developer, I want documentation for common testing issues, so that I can troubleshoot problems quickly.

#### Acceptance Criteria

1. THE API_Testing_Documentation SHALL include a troubleshooting section for common issues
2. WHEN JWT_Token extraction fails, THE troubleshooting section SHALL provide alternative methods (Network tab, Application tab)
3. WHEN Swagger_UI authorization fails, THE troubleshooting section SHALL explain proper Bearer token format
4. WHEN CORS errors occur, THE troubleshooting section SHALL explain frontend-backend URL configuration
5. WHEN database connection fails, THE troubleshooting section SHALL reference CONFIGURATION_SETUP.md
6. WHEN Supabase authentication fails, THE troubleshooting section SHALL reference AUTHENTICATION_SETUP.md
7. WHEN test data is missing, THE troubleshooting section SHALL explain how to run database migrations and seed scripts
8. FOR EACH common issue, THE troubleshooting section SHALL provide step-by-step resolution instructions
