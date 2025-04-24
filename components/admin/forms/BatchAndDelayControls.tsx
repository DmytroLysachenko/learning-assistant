import { Slider } from "../../ui/slider";

const BatchAndDelayControls = ({
  batchSize,
  delay,
  isDisabled,
  setBatchSize,
  setDelay,
}: {
  batchSize: number;
  delay: number;
  isDisabled: boolean;
  setBatchSize: (value: number) => void;
  setDelay: (value: number) => void;
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="batchSize"
            className="text-sm font-medium"
          >
            Batch Size: {batchSize}
          </label>
          <span className="text-xs text-muted-foreground">Words per batch</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-xs">10</span>
          <Slider
            id="batchSize"
            disabled={isDisabled}
            value={[batchSize]}
            min={10}
            max={100}
            step={5}
            onValueChange={(value) => setBatchSize(value[0])}
            className="flex-1"
          />
          <span className="text-xs">100</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="delay"
            className="text-sm font-medium"
          >
            Delay: {delay}ms
          </label>
          <span className="text-xs text-muted-foreground">
            Time between batches
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-xs">1000ms</span>
          <Slider
            id="delay"
            disabled={isDisabled}
            value={[delay]}
            min={1000}
            max={10000}
            step={500}
            onValueChange={(value) => setDelay(value[0])}
            className="flex-1"
          />
          <span className="text-xs">10000ms</span>
        </div>
      </div>
    </div>
  );
};

export default BatchAndDelayControls;
