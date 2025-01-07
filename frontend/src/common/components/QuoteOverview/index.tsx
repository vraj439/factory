interface IQuoteOverviewProps {
  warning?: string;
  leadTime?: string;
  itemCount?: number;
  itemQuantity?: number;
  cost?: number;
}

const QuoteOverview = ({ warning, leadTime, itemCount = 1, itemQuantity = 1, cost }: IQuoteOverviewProps) => {
  return (
    <div className="p-6 bg-white shadow rounded-lg h-full">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      {warning && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 flex items-center">
        <span className="text-sm">⚠️ {warning}</span>
      </div>}
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Lead Time</span>
          <span>{leadTime ? leadTime : '-'}</span>
        </div>
        <div className="flex justify-between">
          <span>Items</span>
          <span>{itemCount} Items / {itemQuantity} Quantity</span>
        </div>
        <div className="flex justify-between">
          <span>Cost</span>
          <span>{cost || '-'}</span>
        </div>
      </div>
      {/* Action Button */}
      <button className="mt-6 w-full bg-blue-100 text-blue-600 py-2 px-4 rounded hover:bg-blue-200">
        Configure to Get Quote
      </button>
    </div>
  );
};

export default QuoteOverview;
