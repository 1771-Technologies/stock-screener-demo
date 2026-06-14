export function ExpressionFilterPlaceholder({
  expressionFilter,
}: {
  expressionFilter: string;
}) {
  if (!expressionFilter) return;

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-xs text-(--ln-gray-60)">Operator</div>
      <div className="text-xs text-(--ln-gray-60)">Values</div>
      <input
        data-ln-input
        disabled
        style={{ height: 28 }}
        className="text-xs w-full opacity-50 cursor-not-allowed"
        value="Expression filter"
      />
      <input
        data-ln-input
        disabled
        style={{ height: 28 }}
        className="text-xs w-full opacity-50 cursor-not-allowed"
        value={expressionFilter}
      />
    </div>
  );
}
