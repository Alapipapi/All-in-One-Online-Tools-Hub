import React, { useState } from 'react';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const handleDigitClick = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const handleDecimalClick = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const handleOperatorClick = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (currentValue === null) {
            setCurrentValue(inputValue);
        } else if (operator) {
            const result = performCalculation();
            setCurrentValue(result);
            setDisplay(String(result));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const performCalculation = (): number => {
        const inputValue = parseFloat(display);
        if (currentValue === null || operator === null) return inputValue;

        switch (operator) {
            case '+': return currentValue + inputValue;
            case '-': return currentValue - inputValue;
            case '*': return currentValue * inputValue;
            case '/': return currentValue / inputValue;
            default: return inputValue;
        }
    };

    const handleEqualsClick = () => {
        if (operator === null || currentValue === null) return;
        const result = performCalculation();
        setDisplay(String(result));
        setCurrentValue(result);
        setOperator(null);
        setWaitingForOperand(true);
    };

    const handleClearClick = () => {
        setDisplay('0');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const handlePercentageClick = () => {
        setDisplay(String(parseFloat(display) / 100));
    };
    
    const handleSignChange = () => {
        setDisplay(String(parseFloat(display) * -1));
    };

    const Button = ({ children, onClick, className = '' }: { children: React.ReactNode, onClick: () => void, className?: string }) => (
        <button
            onClick={onClick}
            className={`text-2xl font-semibold rounded-lg h-16 transition-colors duration-200 ${className}`}
        >
            {children}
        </button>
    );

    return (
        <div className="w-full max-w-xs mx-auto bg-gray-800 text-white p-4 rounded-xl shadow-lg">
            <div className="bg-gray-700 rounded p-4 mb-4 text-right text-4xl font-mono break-all h-20 flex items-end justify-end">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-2">
                <Button onClick={handleClearClick} className="bg-gray-500 hover:bg-gray-600">AC</Button>
                <Button onClick={handleSignChange} className="bg-gray-500 hover:bg-gray-600">+/-</Button>
                <Button onClick={handlePercentageClick} className="bg-gray-500 hover:bg-gray-600">%</Button>
                <Button onClick={() => handleOperatorClick('/')} className="bg-orange-500 hover:bg-orange-600">÷</Button>
                
                <Button onClick={() => handleDigitClick('7')} className="bg-gray-600 hover:bg-gray-700">7</Button>
                <Button onClick={() => handleDigitClick('8')} className="bg-gray-600 hover:bg-gray-700">8</Button>
                <Button onClick={() => handleDigitClick('9')} className="bg-gray-600 hover:bg-gray-700">9</Button>
                <Button onClick={() => handleOperatorClick('*')} className="bg-orange-500 hover:bg-orange-600">×</Button>
                
                <Button onClick={() => handleDigitClick('4')} className="bg-gray-600 hover:bg-gray-700">4</Button>
                <Button onClick={() => handleDigitClick('5')} className="bg-gray-600 hover:bg-gray-700">5</Button>
                <Button onClick={() => handleDigitClick('6')} className="bg-gray-600 hover:bg-gray-700">6</Button>
                <Button onClick={() => handleOperatorClick('-')} className="bg-orange-500 hover:bg-orange-600">−</Button>

                <Button onClick={() => handleDigitClick('1')} className="bg-gray-600 hover:bg-gray-700">1</Button>
                <Button onClick={() => handleDigitClick('2')} className="bg-gray-600 hover:bg-gray-700">2</Button>
                <Button onClick={() => handleDigitClick('3')} className="bg-gray-600 hover:bg-gray-700">3</Button>
                <Button onClick={() => handleOperatorClick('+')} className="bg-orange-500 hover:bg-orange-600">+</Button>
                
                <Button onClick={() => handleDigitClick('0')} className="bg-gray-600 hover:bg-gray-700 col-span-2">0</Button>
                <Button onClick={handleDecimalClick} className="bg-gray-600 hover:bg-gray-700">.</Button>
                <Button onClick={handleEqualsClick} className="bg-orange-500 hover:bg-orange-600">=</Button>
            </div>
        </div>
    );
};

export default Calculator;
