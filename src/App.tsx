import { useState, useCallback } from 'react';
import Scene3D from './components/Scene3D';
import { buildAllModules } from './utils/moduleBuilder';

const modules = buildAllModules();

export default function App() {
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const handleModuleHover = useCallback((index: number | null) => {
    setHoveredModule(index);
  }, []);

  const handleModuleClick = useCallback((index: number | null) => {
    setSelectedModule((prev) => (prev === index ? null : index));
  }, []);

  const activeModule = selectedModule !== null ? selectedModule : hoveredModule;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0f]">
      {/* 3D Scene */}
      <Scene3D
        explodeProgress={explodeProgress}
        selectedModule={selectedModule}
        hoveredModule={hoveredModule}
        onModuleHover={handleModuleHover}
        onModuleClick={handleModuleClick}
        autoRotate={autoRotate}
      />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DJI Osmo Pocket 4
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">交互式3D结构拆解 · Interactive 3D Teardown</p>
          </div>
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                autoRotate
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {autoRotate ? '⟳ 自动旋转' : '⟳ 手动控制'}
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                showInfo
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {showInfo ? '◉ 信息面板' : '○ 信息面板'}
            </button>
          </div>
        </div>
      </div>

      {/* Explode Slider */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4 w-[400px] max-w-[90vw]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">组装</span>
            <span className="text-xs text-white font-medium">
              拆解程度 {Math.round(explodeProgress * 100)}%
            </span>
            <span className="text-xs text-gray-400">完全拆解</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={explodeProgress * 100}
            onChange={(e) => setExplodeProgress(Number(e.target.value) / 100)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer
              bg-gradient-to-r from-blue-500 to-purple-500
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-blue-500/50
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between mt-3 gap-2">
            <button
              onClick={() => setExplodeProgress(0)}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-all border border-white/5"
            >
              组装状态
            </button>
            <button
              onClick={() => setExplodeProgress(0.5)}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-all border border-white/5"
            >
              半拆解
            </button>
            <button
              onClick={() => setExplodeProgress(1)}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-all border border-white/5"
            >
              完全拆解
            </button>
          </div>
        </div>
      </div>

      {/* Module List - Left Side */}
      {showInfo && (
        <div className="absolute left-4 top-20 bottom-24 z-10 pointer-events-auto overflow-y-auto w-56 scrollbar-thin">
          <div className="space-y-1.5">
            {modules.map((mod, index) => (
              <button
                key={index}
                onClick={() => setSelectedModule(selectedModule === index ? null : index)}
                onMouseEnter={() => setHoveredModule(index)}
                onMouseLeave={() => setHoveredModule(null)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 ${
                  selectedModule === index
                    ? 'bg-white/15 border border-white/20 shadow-lg'
                    : hoveredModule === index
                    ? 'bg-white/8 border border-white/10'
                    : 'bg-white/3 border border-transparent hover:bg-white/6'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: mod.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white truncate">
                      {mod.name}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {mod.nameEn}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Module Detail Panel - Right Side */}
      {showInfo && activeModule !== null && (
        <div className="absolute right-4 top-20 z-10 pointer-events-auto w-72 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: modules[activeModule].color }}
              />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {modules[activeModule].name}
                </h3>
                <p className="text-xs text-gray-500">
                  {modules[activeModule].nameEn}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {modules[activeModule].description}
            </p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">模块编号</span>
                <span className="text-[10px] text-white font-mono">
                  #{String(activeModule + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] text-gray-600 text-center">
          拖拽旋转 · 滚轮缩放 · 点击选择模块
        </p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/30 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500/30 pointer-events-none" />
    </div>
  );
}
