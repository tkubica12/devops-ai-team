import React from 'react';
import Button from '@mui/material/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Wardrobe = () => {
  const items = [
    { id: 'summer', content: 'Summer Outfit' },
    { id: 'winter', content: 'Winter Outfit' },
    { id: 'halloween', content: 'Halloween Costume' },
  ];

  const onDragEnd = (result) => {
    if (!result.destination) return;
    // Handle reordering logic here
  };

  return (
    <div className="wardrobe mt-8">
      <h3 className="text-lg font-bold">Wardrobe</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="wardrobe">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-200 p-2 mt-2 rounded"
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button variant="contained" color="primary" className="mt-4">
        Get Notified for New Outfits
      </Button>
    </div>
  );
};

export default Wardrobe;
