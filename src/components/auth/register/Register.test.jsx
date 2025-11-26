// Import testing utilities from Vitest
import { describe, it, expect, vi, beforeEach } from "vitest";
// Import React Testing Library utilities
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";
import { useAuth } from "../../../contexts/authContext";
import {
  doCreateUserWithEmailAndPassword,
  doSendVerificationEmail,
} from "../../../firebase/auth";

// Mock external dependencies
vi.mock("../../../contexts/authContext");
vi.mock("../../../firebase/auth");

const mockNavigate = vi.fn();

// Mock the navigate function from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render components with router context
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Group related tests together
describe("Register Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      userLoggedIn: false,
    });
  });

  // TEST 1: Check if the registration form renders correctly
  it("should render the registration form with all required fields", () => {
    renderWithRouter(<Register />);

    // Verify all form fields are present
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create An Account/i })
    ).toBeInTheDocument();
  });

  // TEST 2: Check if user input updates the form fields
  it("should update form fields when user types", () => {
    renderWithRouter(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    // Simulate user typing in all fields
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    // Verify the values were updated
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(confirmPasswordInput.value).toBe("password123");
  });

  // TEST 3: Check password validation
  it("should show error when passwords do not match", async () => {
    renderWithRouter(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: /Create An Account/i,
    });

    // Fill in the form with non-matching passwords
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentpassword" },
    });
    
    // Submit the form
    fireEvent.click(submitButton);

    // Check if error message appears
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    // Verify that the registration function was NOT called
    expect(doCreateUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  // TEST 4: Check successful registration
  it("should create account and send verification email on successful registration", async () => {
    // Mock successful registration
    const mockUser = { uid: "123", email: "test@example.com" };
    doCreateUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    doSendVerificationEmail.mockResolvedValue();

    renderWithRouter(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: /Create An Account/i,
    });

    // Fill in the form with matching passwords
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Verify the functions were called correctly
    await waitFor(() => {
      expect(doCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(doSendVerificationEmail).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith("/verify-email");
    });
  });

  // TEST 5: Check error handling
  it("should display error message when registration fails", async () => {
    // Mock a failed registration
    doCreateUserWithEmailAndPassword.mockRejectedValue({
      message: "Email already in use",
    });

    renderWithRouter(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: /Create An Account/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Email already in use/i)).toBeInTheDocument();
    });
  });

  // TEST 6: Check if form is disabled during registration
  it("should disable form inputs during registration", async () => {
    // Mock a slow registration process
    doCreateUserWithEmailAndPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderWithRouter(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: /Create An Account/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Check if button is disabled and text changes during registration
    expect(submitButton).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
  });
});
