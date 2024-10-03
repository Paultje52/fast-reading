export type TextareaProps = {
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>,
  value: string
};

export type PdfDropProps = {
  onChange: (value: string) => void
};

export type SpeedSliderProps = {
  onChange: (speed: number) => void,
  currentSpeed: number
};