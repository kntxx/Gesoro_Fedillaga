// Import testing utilities from Vitest
import { describe, it, expect, vi, beforeEach } from "vitest";
// Import React Testing Library utilities
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { useAuth } from "../../../contexts/authContext";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";

// Mock external dependencies so we can control their behavior in tests
vi.mock("../../../contexts/authContext");
vi.mock("../../../firebase/auth");
vi.mock("../../../assets/googleIcon.svg", () => ({
  default: "google-icon.svg",
}));

// Helper function to render components with router context
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Group related tests together using 'describe'
describe("Login Component", () => {
  // Run this before each test to reset mocks and set default values
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      userLoggedIn: false,
    });
  });

  // TEST 1: Check if the component renders correctly
  it("should render the login form with all required fields", () => {
    renderWithRouter(<Login />);

    // Check if important elements are in the document
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  // TEST 2: Check if user input updates the form fields
  it("should update input fields when user types", () => {
    renderWithRouter(<Login />);

    // Get the input elements
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the values updated correctly
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  // TEST 3: Check if form submission works correctly
  it("should call sign in function when form is submitted with valid credentials", async () => {
    // Mock a successful login with verified email
    const mockUser = {
      emailVerified: true,
    };
    doSignInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    renderWithRouter(<Login />);

    // Fill in the form
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    // Submit the form
    fireEvent.click(submitButton);

    // Wait for async operations and check if the function was called
    await waitFor(() => {
      expect(doSignInWithEmailAndPassword).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });
  });

  // TEST 4: Check if error messages are displayed
  it("should display error message when login fails", async () => {
    // Mock a failed login
    doSignInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-credential",
      message: "Invalid credential",
    });

    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Invalid email or password/i)
      ).toBeInTheDocument();
    });
  });

  // TEST 5: Check if form is disabled during submission
  it("should disable submit button while signing in", async () => {
    // Mock a slow sign-in process
    doSignInWithEmailAndPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Check if button is disabled during submission
    expect(submitButton).toBeDisabled();
  });
});
