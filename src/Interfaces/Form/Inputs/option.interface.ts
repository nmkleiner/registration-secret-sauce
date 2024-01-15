export interface OptionInterface {
  id: string;
  label: string;
  value: string;
  sort: number;
  isVisible: boolean;
  hide: () => void;
  show: () => void;
}
