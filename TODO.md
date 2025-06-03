# TODO.md

## Strengths to Maintain

- [ ] Continue to follow a modular approach for new features.
- [ ] Ensure clear separation of concerns in new components.
- [ ] Maintain the use of Zustand for state management.
- [ ] Use `react-hot-toast` for user notifications.
- [ ] Ensure charts are interactive and responsive.

## Areas for Improvement

- [x] Refactor duplicated code in `GradesTable`.
- [ ] Add comprehensive validation for all user inputs.
- [ ] Conduct an accessibility audit and address issues.
- [ ] Optimize rendering using `useMemo` and `useCallback`.

## Specific Tasks

- [~] Set up Jest for testing (initial setup and first tests in progress).
- [~] Write unit tests for `GradesTable` (initial tests written, ongoing).
- [x] Add `aria-label` attributes to buttons for accessibility.
- [ ] Wrap API calls in `useCourseStore` with try-catch blocks.
- [ ] Provide user feedback for network errors.
- [ ] Ensure forms in `StudentForm` are accessible.
- [ ] Ensure "Strengths to Maintain" are covered in developer documentation.
