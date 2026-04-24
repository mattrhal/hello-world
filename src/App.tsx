import React, { useState, useRef, ChangeEvent } from 'react';

interface FilterState {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
}

const initialFilters: FilterState = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
};

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateFilter = (name: keyof FilterState, value: number) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const backdropFilterString = [
    `blur(${filters.blur}px)`,
    `brightness(${filters.brightness}%)`,
    `contrast(${filters.contrast}%)`,
    `grayscale(${filters.grayscale}%)`,
    `hue-rotate(${filters.hueRotate}deg)`,
    `invert(${filters.invert}%)`,
    `opacity(${filters.opacity}%)`,
    `saturate(${filters.saturate}%)`,
    `sepia(${filters.sepia}%)`,
  ].join(' ');

  const copyToClipboard = () => {
    const css = `backdrop-filter: ${backdropFilterString};`;
    navigator.clipboard.writeText(css).then(() => {
      alert('CSS copied to clipboard!');
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Side Panel */}
      <div className="w-full md:w-80 bg-white shadow-xl flex flex-col h-full z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Backdrop Filter</h1>
          <p className="text-sm text-gray-500">Test backdrop-filter on your images</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {image && (
              <button
                onClick={resetFilters}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded transition duration-200"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="space-y-4">
            <FilterSlider label="Blur" value={filters.blur} min={0} max={20} unit="px" onChange={(v) => updateFilter('blur', v)} />
            <FilterSlider label="Brightness" value={filters.brightness} min={0} max={200} unit="%" onChange={(v) => updateFilter('brightness', v)} />
            <FilterSlider label="Contrast" value={filters.contrast} min={0} max={200} unit="%" onChange={(v) => updateFilter('contrast', v)} />
            <FilterSlider label="Grayscale" value={filters.grayscale} min={0} max={100} unit="%" onChange={(v) => updateFilter('grayscale', v)} />
            <FilterSlider label="Hue Rotate" value={filters.hueRotate} min={0} max={360} unit="deg" onChange={(v) => updateFilter('hueRotate', v)} />
            <FilterSlider label="Invert" value={filters.invert} min={0} max={100} unit="%" onChange={(v) => updateFilter('invert', v)} />
            <FilterSlider label="Opacity" value={filters.opacity} min={0} max={100} unit="%" onChange={(v) => updateFilter('opacity', v)} />
            <FilterSlider label="Saturate" value={filters.saturate} min={0} max={200} unit="%" onChange={(v) => updateFilter('saturate', v)} />
            <FilterSlider label="Sepia" value={filters.sepia} min={0} max={100} unit="%" onChange={(v) => updateFilter('sepia', v)} />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="bg-gray-800 text-white p-3 rounded-lg mb-3">
            <code className="text-xs break-all">backdrop-filter: {backdropFilterString};</code>
          </div>
          <button
            onClick={copyToClipboard}
            className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Copy CSS
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        {!image ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg max-w-md">
            <div className="mb-4 text-blue-500">
               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Image Uploaded</h2>
            <p className="text-gray-600 mb-6">Upload an image to start experimenting with backdrop filters.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-200"
            >
              Upload Now
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-4xl max-h-full flex items-center justify-center">
            <img
              src={image}
              alt="Uploaded Preview"
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain"
            />
            {/* The Overlay applying backdrop-filter */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div
                    style={{ backdropFilter: backdropFilterString, WebkitBackdropFilter: backdropFilterString }}
                    className="w-1/2 h-1/2 border-2 border-white/30 rounded-lg shadow-lg"
                >
                    <div className="h-full w-full flex items-center justify-center">
                        <span className="bg-white/20 text-white px-3 py-1 rounded text-sm font-medium border border-white/30 backdrop-blur-sm">
                            Filter Area
                        </span>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface FilterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

const FilterSlider: React.FC<FilterSliderProps> = ({ label, value, min, max, unit, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
};

export default App;
