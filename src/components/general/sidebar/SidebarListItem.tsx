import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

interface SidebarListItemProps {
    text: string;
}

const SidebarListItem: React.FC<SidebarListItemProps> = ({ text }) => {
    return (
        <ListItem button>
            <ListItemText primary={text} />
        </ListItem>
    );
};

export default SidebarListItem;
