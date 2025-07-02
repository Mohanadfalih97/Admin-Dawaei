import { Button } from "./Ui/Button";
import { Input } from "./Ui/Input";

const VoteNominations = ({
  options,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}) => {
  return (
    <div className="space-y-4 mt-6" style={{direction:"rtl"}}>
      <div className="flex justify-between items-center">
        <label>خيارات التصويت</label>
        <Button type="button"  onClick={onAddOption}>
          إضافة خيار
        </Button>
      </div>

      {options.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={option}
            onChange={(e) => onOptionChange(index, e.target.value)}
            placeholder={`الخيار ${index + 1}`}
            className="w-full p-2"
            required
          />
          <Button
            type="button"
            onClick={() => onRemoveOption(index)}
            disabled={options.length <= 2}
            className="text-destructive hover:bg-destructive/10"
          >
            حذف
          </Button>
        </div>
      ))}
    </div>
  );
};

export default VoteNominations;
