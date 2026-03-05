export default function DemoModeToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className={enabled ? "demoToggle active" : "demoToggle"}
      onClick={onToggle}
    >
      {enabled ? "Demo Mode: ON" : "Demo Mode: OFF"}
    </button>
  );
}
