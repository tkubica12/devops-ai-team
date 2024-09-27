import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const CustomizationMenu = ({ pet, onClose }) => {
  const [preview, setPreview] = useState(pet);
  const [name, setName] = useState('');
  const [items, setItems] = useState(["Appearance", "Name", "Animations"]);

  const handleCustomization = (newAppearance) => {
    setPreview(newAppearance);
  };

  const handleTextSizeChange = (size) => {
    document.documentElement.style.setProperty('--text-size', size);
    localStorage.setItem('textSize', size);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(reorderedItems);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <h2>Customize Your Pet</h2>

        {/* Drag and Drop context */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="my-4">
                {items.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border p-2 rounded mb-2 bg-gray-100 cursor-pointer"
                      >
                        {item}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter pet name"
          className="border p-2 rounded mb-2 w-full"
        />
        <button onClick={() => handleCustomization({ name: name || 'Custom Pet' })} className="mt-2 bg-blue-500 text-white rounded px-4 py-2">Apply Changes</button>
        <div className="mt-4">
          <h3>Text Size</h3>
          <button onClick={() => handleTextSizeChange('var(--text-size-small)')} className="bg-gray-300 text-black px-2 py-1 rounded mr-2">Small</button>
          <button onClick={() => handleTextSizeChange('var(--text-size-medium)')} className="bg-gray-300 text-black px-2 py-1 rounded mr-2">Medium</button>
          <button onClick={() => handleTextSizeChange('var(--text-size-large)')} className="bg-gray-300 text-black px-2 py-1 rounded">Large</button>
        </div>
        <button onClick={onClose} className="mt-2 bg-red-500 text-white rounded px-4 py-2">Close</button>
      </div>
    </div>
  );
};

export default CustomizationMenu;
