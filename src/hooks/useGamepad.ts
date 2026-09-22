import { useState, useEffect } from 'react';

export interface GamepadInfo {
  index: number;
  id: string;
  connected: boolean;
  timestamp: number;
  axes: number[];
  buttons: { pressed: boolean; value: number }[];
  mapping: string;
  vendorName: string; // e.g. "Xbox Controller", "DualSense / PS5", "Nintendo Switch Pro", "Generic USB"
  isStandard: boolean;
}

export function detectGamepadType(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes('045e') || lower.includes('xbox') || lower.includes('x-input') || lower.includes('xinput')) {
    return 'Xbox Controller (Series X/S / One / 360)';
  }
  if (lower.includes('054c') || lower.includes('dualsense') || lower.includes('dualshock') || lower.includes('sony') || lower.includes('playstation')) {
    return 'PlayStation Controller (DualSense / DualShock 4)';
  }
  if (lower.includes('057e') || lower.includes('switch') || lower.includes('pro controller') || lower.includes('joy-con')) {
    return 'Nintendo Switch (Pro Controller / Joy-Con)';
  }
  if (lower.includes('8bitdo')) {
    return '8BitDo Bluetooth / USB Gamepad';
  }
  if (lower.includes('logitech')) {
    return 'Logitech Gamepad (F310 / F710)';
  }
  if (lower.includes('snes') || lower.includes('nes') || lower.includes('genesis') || lower.includes('retro')) {
    return 'Retro USB Joystick / Controller';
  }
  return 'Mando USB / Bluetooth Estándar (W3C Standard Gamepad)';
}

export function useGamepad() {
  const [gamepads, setGamepads] = useState<GamepadInfo[]>([]);
  const [activeGamepad, setActiveGamepad] = useState<GamepadInfo | null>(null);

  useEffect(() => {
    let animFrameId: number;

    const pollGamepads = () => {
      if (typeof window === 'undefined' || !navigator.getGamepads) return;

      const rawGamepads = navigator.getGamepads();
      const connectedList: GamepadInfo[] = [];

      for (let i = 0; i < rawGamepads.length; i++) {
        const gp = rawGamepads[i];
        if (gp && gp.connected) {
          connectedList.push({
            index: gp.index,
            id: gp.id,
            connected: gp.connected,
            timestamp: gp.timestamp,
            mapping: gp.mapping,
            vendorName: detectGamepadType(gp.id),
            isStandard: gp.mapping === 'standard',
            axes: Array.from(gp.axes).map((a) => Math.round(a * 100) / 100),
            buttons: Array.from(gp.buttons).map((b) => ({
              pressed: b.pressed || b.value > 0.15,
              value: Math.round(b.value * 100) / 100,
            })),
          });
        }
      }

      setGamepads(connectedList);
      if (connectedList.length > 0) {
        setActiveGamepad(connectedList[0]);
      } else {
        setActiveGamepad(null);
      }

      animFrameId = requestAnimationFrame(pollGamepads);
    };

    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log('Gamepad conectado:', e.gamepad.id);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad desconectado:', e.gamepad.id);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    animFrameId = requestAnimationFrame(pollGamepads);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return {
    gamepads,
    activeGamepad,
    hasConnectedGamepad: gamepads.length > 0,
  };
}
