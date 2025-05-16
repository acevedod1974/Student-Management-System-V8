/**
 * Button component types
 */
import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "outline"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Additional class names
   */
  className?: string;

  /**
   * Button variant/style
   */
  variant?: ButtonVariant;

  /**
   * Button size
   */
  size?: ButtonSize;

  /**
   * Show loading spinner
   */
  isLoading?: boolean;

  /**
   * Icon displayed before button text
   */
  leftIcon?: ReactNode;

  /**
   * Icon displayed after button text
   */
  rightIcon?: ReactNode;

  /**
   * Make button take full width of container
   */
  fullWidth?: boolean;
}
