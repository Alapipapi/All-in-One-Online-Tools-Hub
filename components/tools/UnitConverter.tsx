import React, { useState, useMemo, useCallback } from 'react';
import { UnitType } from '../../types';

const units = {
  [UnitType.Length]: { meters: 1, kilometers: 1000, miles: 1609.34, feet: 0.3048, inches: 0.0254 },
  [UnitType.Weight]: { kilograms: 1, grams: 0.001, pounds: 0.453592, ounces: 0.0283495 },
  [UnitType.Temperature]: {},
};

const UnitConverter: React.FC = () => {
  const [unitType, setUnitType] = useState<UnitType>(UnitType.Length);
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');

  const handleTypeChange = (newType: UnitType) => {
    setUnitType(newType);
    if (newType === UnitType.Length) {
      setFromUnit('meters');
      setToUnit('feet');
    } else if (newType === UnitType.Weight) {
      setFromUnit('kilograms');
      setToUnit('pounds');
    } else if (newType === UnitType.Temperature) {
      setFromUnit('celsius');
      setToUnit('fahrenheit');
    }
    setInputValue('1');
  };
  
  const convert = useCallback(() => {
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) return '';

    if (unitType === UnitType.Temperature) {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') return (inputNum * 9 / 5 + 32).toFixed(2);
      if (fromUnit === 'fahrenheit' && toUnit === 'celsius') return ((inputNum - 32) * 5 / 9).toFixed(2);
      if (fromUnit === 'celsius' && toUnit === 'kelvin') return (inputNum + 273.15).toFixed(2);
      if (fromUnit === 'kelvin' && toUnit === 'celsius') return (inputNum - 273.15).toFixed(2);
      if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') return ((inputNum - 32) * 5 / 9 + 273.15).toFixed(2);
      if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') return ((inputNum - 273.15) * 9 / 5 + 32).toFixed(2);
      return inputNum.toFixed(2);
    }

    const fromValueInBase = inputNum * units[unitType][fromUnit];
    const toValue = fromValueInBase / units[unitType][toUnit];
    return toValue.toFixed(4);
  }, [inputValue, fromUnit, toUnit, unitType]);

  const outputValue = useMemo(() => convert(), [convert]);
  
  const currentUnits = useMemo(() => {
    if (unitType === UnitType.Temperature) return ['celsius', 'fahrenheit', 'kelvin'];
    return Object.keys(units[unitType]);
  }, [unitType]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        {Object.values(UnitType).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 text-sm font-medium rounded-md w-full transition ${unitType === type ? 'bg-blue-500 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="from-value" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
          <input
            id="from-value"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {currentUnits.map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
          </select>
        </div>
        <div className="flex justify-center items-center text-gray-500 text-2xl font-light">
          =
        </div>
        <div className="flex flex-col">
          <label htmlFor="to-value" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
          <input
            id="to-value"
            type="text"
            value={outputValue}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
          />
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
             {currentUnits.map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;