import { useEffect, useState } from 'react';
import { useDragDropManager } from 'react-dnd';

export function useIsDragging() {
  const dragDropManager = useDragDropManager();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function onChange() {
      setIsDragging(dragDropManager.getMonitor().isDragging());
    }

    const clearSubscription = dragDropManager.getMonitor().subscribeToStateChange(onChange);
    return function () {
      clearSubscription();
    };
  }, [dragDropManager]);

  return isDragging;
}
