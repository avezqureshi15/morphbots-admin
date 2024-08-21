import React, { useEffect, useState } from 'react';
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrimaryButton from '../../components/custom/PrimaryButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditTutorial from './Tutorial/EditTutorial';
import EditChapter from './Chapter/EditChapter';
import AddNewChapter from './Chapter/AddNewChapter';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { getTutorials, deleteTutorial, editTutorial, editChapter, Chapter, deleteChapter, getChapters } from '../../slices/curriculumSlice';
import Loader from '../../components/custom/Loader';
interface Tutorial {
    id: string;
    title: string;
    subheading: string;
    body: string;
    files: string[];
    chapters: Chapter[];
}


const AccordionsWithChapters = () => {
    const dispatch = useAppDispatch();
    const { tutorials, chapters, loading, error } = useAppSelector((state) => state.curriculum);
    //@ts-expect-error
    const chapterData = chapters.data;
    console.log(chapterData)
    const [isEditTutorialOpen, setIsEditTutorialOpen] = useState(false);
    const [isEditChapterOpen, setIsEditChapterOpen] = useState(false);
    const [isAddNewChapterOpen, setIsAddNewChapterOpen] = useState(false);
    const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedTutorialIdForNewChapter, setSelectedTutorialIdForNewChapter] = useState<string | null>(null);
    const [deletingState, setDeletingState] = useState<{ [key: string]: boolean }>({});
    console.log(selectedTutorial)
    useEffect(() => {
        dispatch(getTutorials());
        dispatch(getChapters());
    }, [dispatch]);
    const handleOpenEditTutorial = (tutorial: Tutorial) => {
        setSelectedTutorial(tutorial);
        setIsEditTutorialOpen(true);
    };

    const handleCloseEditTutorial = () => {
        setIsEditTutorialOpen(false);
        setSelectedTutorial(null);
    };

    const handleOpenEditChapter = (chapter: Chapter) => {
        const chapterWithDefaults = {
            ...chapter,
            files: chapter.files || []
        };
        setSelectedChapter(chapterWithDefaults);
        setIsEditChapterOpen(true);
    };

    const handleCloseEditChapter = () => {
        setIsEditChapterOpen(false);
        setSelectedChapter(null);
    };

    const handleOpenAddNewChapter = (tutorialId: string) => {
        setSelectedTutorialIdForNewChapter(tutorialId);
        setIsAddNewChapterOpen(true);
    };

    const handleCloseAddNewChapter = () => {
        setIsAddNewChapterOpen(false);
        setSelectedTutorialIdForNewChapter(null);
    };

    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        console.log(event);
    };

    const handleSaveTutorial = (formData: FormData) => {
        if (selectedTutorial) {
            dispatch(editTutorial({ id: selectedTutorial.id, formData }));
            console.log('Updated Tutorial:', formData);
        }
        dispatch(getTutorials());
    };

    const handleSaveChapter = (chapter: Chapter) => {
        const formData = new FormData();
        formData.append('title', chapter.title);
        formData.append('subheading', chapter.subheading);
        formData.append('body', chapter.body);
        // Add other fields as needed

        dispatch(editChapter({ id: chapter.id, formData }));
        dispatch(getTutorials());
    };

    const handleDeleteTutorial = async (id: string) => {
        try {
            setDeletingState((prev) => ({ ...prev, [id]: true }));
            await dispatch(deleteTutorial(id));
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingState((prev) => ({ ...prev, [id]: false }));
        }
    };


    const handleDeleteChapter = async (id: string) => {
        try {
            setDeletingState((prev) => ({ ...prev, [id]: true }));
            await dispatch(deleteChapter(id));
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingState((prev) => ({ ...prev, [id]: false }));
        }
    };

    return (
        <>
            <Box sx={{ width: '1100px', margin: '2rem' }}>
                {loading && <Loader />}
                {error && <Typography color="error">{error}</Typography>}
                {tutorials && tutorials.map((tutorial) => (
                    <Accordion
                        key={tutorial.id}
                        expanded={expanded === tutorial.id}
                        onChange={handleChange(tutorial.id)}
                        sx={{ backgroundColor: Number(tutorial.id) % 2 === 0 ? 'white' : '#F7F9FA' }}
                    >

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            aria-controls={`${tutorial.id}-content`}
                            id={`${tutorial.id}-header`}
                            sx={{
                                flexDirection: 'row-reverse', height: '64px',
                            }}
                        >
                            <Box
                                component='div'
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                }}
                            >
                                <Box
                                    component='div'
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '7px',
                                            backgroundColor: '#6ECDDD',
                                            marginRight: '10px'
                                        }}
                                    >
                                        <ExpandMoreIcon sx={{ color: 'white' }} />
                                    </Box>
                                    <Typography sx={{ flexShrink: 0, fontWeight: 700, fontSize: '16px' }}>
                                        {tutorial.title}
                                    </Typography>
                                </Box>
                                <Box
                                    component='div'
                                    sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    <PrimaryButton
                                        variant='filled'
                                        textTransform='capitalize'
                                        height='31px'
                                        width='190px'
                                        fontWeight='600'
                                        fontSize='13px'
                                        icon={NoteAddIcon}
                                        fontFamily='Roboto, sans-serif'
                                        letterSpacing='1px'
                                        onClick={() => handleOpenAddNewChapter(tutorial.id)}
                                    >
                                        Add New Chapter
                                    </PrimaryButton>
                                    <PrimaryButton
                                        variant='filled'
                                        textTransform='capitalize'
                                        height='31px'
                                        width='80px'
                                        fontWeight='600'
                                        fontSize='13px'
                                        icon={EditIcon}
                                        fontFamily='Roboto, sans-serif'
                                        letterSpacing='1px'
                                        onClick={() => handleOpenEditTutorial(tutorial)}
                                    >
                                        Edit
                                    </PrimaryButton>
                                    <PrimaryButton
                                        variant='filled'
                                        textTransform='capitalize'
                                        height='31px'
                                        width='100px'
                                        fontWeight='600'
                                        fontSize='13px'
                                        backgroundColor='#DD6E70'
                                        borderColor='#DD6E70'
                                        icon={DeleteIcon}
                                        fontFamily='Roboto, sans-serif'
                                        letterSpacing='1px'
                                        onClick={() => handleDeleteTutorial(tutorial.id)}
                                        disabled={deletingState[tutorial.id]}
                                    >
                                        Delete
                                    </PrimaryButton>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {!chapterData ? (
                                    <Loader />  // Display the loader while fetching data
                                ) : (
                                    chapterData && chapterData
                                        .filter((chapter: any) => chapter.tutorial_id === tutorial.id)
                                        .map((chapter: any) => (
                                            <ListItem key={chapter.id}
                                                sx={{
                                                    margin: '-1rem -1rem -1rem 2rem'
                                                }}
                                            >
                                                <ListItemText
                                                    primary={chapter.title}
                                                    secondary={chapter.subheading}
                                                />
                                                <ListItemSecondaryAction>
                                                    <PrimaryButton
                                                        variant='filled'
                                                        height='31px'
                                                        width='30px'
                                                        fontSize='15px'
                                                        icon={EditIcon}
                                                        fontFamily='Roboto, sans-serif'
                                                        style={{ marginRight: '10px' }}
                                                        onClick={() => handleOpenEditChapter(chapter)}
                                                    />
                                                    <PrimaryButton
                                                        variant='filled'
                                                        height='31px'
                                                        width='30px'
                                                        fontSize='15px'
                                                        backgroundColor='#DD6E70'
                                                        borderColor='#DD6E70'
                                                        icon={DeleteIcon}
                                                        fontFamily='Roboto, sans-serif'
                                                        style={{ marginRight: '10px' }}
                                                        onClick={() => handleDeleteChapter(chapter.id)}
                                                    />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))
                                )}
                            </List>

                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
            <EditTutorial
                open={isEditTutorialOpen}
                onClose={handleCloseEditTutorial}
                //@ts-expect-error
                tutorial={selectedTutorial || null}
                //@ts-expect-error
                onSave={handleSaveTutorial}
            />
            <EditChapter
                open={isEditChapterOpen}
                onClose={handleCloseEditChapter}
                chapter={selectedChapter || null}
                onSave={handleSaveChapter}
            />
            <AddNewChapter
                open={isAddNewChapterOpen}
                onClose={handleCloseAddNewChapter}
                tutorialId={selectedTutorialIdForNewChapter || ''}
            />
        </>
    );
};

export default AccordionsWithChapters;
