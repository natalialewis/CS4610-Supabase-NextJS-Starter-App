import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders an input with type password by default", () => {
    render(
      <PasswordInput
        id="pwd"
        value=""
        onChange={() => {}}
        placeholder="Password"
      />
    );
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("id", "pwd");
  });

  it("toggles visibility when show/hide button is clicked", () => {
    render(
      <PasswordInput id="pwd" value="secret" onChange={() => {}} />
    );
    const input = screen.getByDisplayValue("secret");
    const toggle = screen.getByRole("button", { name: /show password/i });
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /hide password/i }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange when input value changes", () => {
    const handleChange = jest.fn();
    render(
      <PasswordInput id="pwd" value="" onChange={handleChange} placeholder="Password" />
    );
    const input = screen.getByPlaceholderText("Password");
    fireEvent.change(input, { target: { value: "new" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("forwards aria-invalid", () => {
    render(
      <PasswordInput id="pwd" value="" onChange={() => {}} aria-invalid={true} />
    );
    const input = document.getElementById("pwd");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
