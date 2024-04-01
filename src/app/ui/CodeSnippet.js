export default function CodeSnippet() {
  return (
    <div>
      <h2>Code Snipper</h2>
      <p>
        This is a code snipper from the file{" "}
        <code>src/app/dashboard/page.jsx</code>
      </p>
      <pre>
        <code>{props.c}</code>
      </pre>
    </div>
  );
}
