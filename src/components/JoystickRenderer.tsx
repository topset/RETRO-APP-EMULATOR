import React from 'react';
import { ConsoleId } from '../types';
import { SnesJoystick } from './joysticks/SnesJoystick';
import { SegaJoystick } from './joysticks/SegaJoystick';
import { GbaJoystick } from './joysticks/GbaJoystick';
import { PsxJoystick } from './joysticks/PsxJoystick';
import { N64Joystick } from './joysticks/N64Joystick';

interface JoystickRendererProps {
  consoleId: ConsoleId;
  className?: string;
  isInteractive?: boolean;
}

export const JoystickRenderer: React.FC<JoystickRendererProps> = ({
  consoleId,
  className = '',
  isInteractive = true,
}) => {
  switch (consoleId) {
    case 'snes':
      return <SnesJoystick className={className} isInteractive={isInteractive} />;
    case 'sega':
      return <SegaJoystick className={className} isInteractive={isInteractive} />;
    case 'gba':
      return <GbaJoystick className={className} isInteractive={isInteractive} />;
    case 'psx':
      return <PsxJoystick className={className} isInteractive={isInteractive} />;
    case 'n64':
      return <N64Joystick className={className} isInteractive={isInteractive} />;
    default:
      return null;
  }
};
