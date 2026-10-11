import { Form } from "react-bootstrap";

export default function Campo({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  as,
}) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>

      <Form.Control
        as={as}
        type={type}
        value={value}
        onChange={onChange}
        isInvalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      <Form.Control.Feedback type="invalid" id={`${id}-error`}>
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}