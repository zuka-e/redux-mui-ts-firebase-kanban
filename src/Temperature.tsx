import React from "react";
import ReactDOM from "react-dom";

const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit"
};

function toCelsius(fahrenheit: number) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius: number) {
  return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature: string, convert: (input: number) => number) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return "";
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

interface TemperatureProps {
  celsius: number;
}

function BoilingVerdict(props: TemperatureProps) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

interface TemperatureInputProps {
  temperature: string;
  scale: "c" | "f";
  onTemperatureChange: (input: string) => void;
}

class TemperatureInput extends React.Component<TemperatureInputProps> {
  constructor(props: TemperatureInputProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature} onChange={this.handleChange} />
      </fieldset>
    );
  }
}

interface CalculatorProps {
  temperature: string;
  scale: "c" | "f";
}
interface CalculatorState {
  temperature: string;
  scale: "c" | "f";
}
class Calculator extends React.Component<CalculatorProps, CalculatorState> {
  constructor(props: CalculatorProps) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = { temperature: "", scale: "c" };
  }

  handleCelsiusChange(temperature: string) {
    this.setState({ scale: "c", temperature });
  }

  handleFahrenheitChange(temperature: string) {
    this.setState({ scale: "f", temperature });
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius =
      scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit =
      scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange}
        />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange}
        />
        <BoilingVerdict celsius={parseFloat(celsius)} />
      </div>
    );
  }
}

ReactDOM.render(
  <Calculator temperature="" scale="c" />,
  document.getElementById("root")
);
