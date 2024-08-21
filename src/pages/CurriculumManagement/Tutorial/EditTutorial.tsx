import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, Typography, IconButton, Card, CardContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import PrimaryTextField from '../../../components/custom/PrimaryTextField';
import PrimaryButton from '../../../components/custom/PrimaryButton';
import { styled } from '@mui/system';
import { useAppDispatch } from '../../../hooks/redux-hook';
import { Tutorial, deleteTutorialAttachments, editTutorial } from '../../../slices/curriculumSlice'; // Assuming you have these in your slice

interface EditTutorialProps {
    open: boolean;
    onClose: () => void;
    tutorial: Tutorial | null;
    onSave: (tutorial: Tutorial) => void;
}

const ModalBox = styled(Box)({
    //@ts-expect-error
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: 24,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
});

const Header = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #EAEBF4',
    paddingBottom: '10px',
});

const EditTutorial: React.FC<EditTutorialProps> = ({ open, onClose, tutorial }) => {
    const [title, setTitle] = useState('');
    const [subHeading, setSubHeading] = useState('');
    const [body, setBody] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const dispatch = useAppDispatch();
    const textAreaRef = useRef(null);
    useEffect(() => {
        if (tutorial) {
            setTitle(tutorial.title);
            setSubHeading(tutorial.subheading);
            setBody(tutorial.body);
            //@ts-expect-error
            setFiles(tutorial.files || []);
        }
    }, [tutorial]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (tutorial) {
            const formData = new FormData();

            formData.append('title', title);
            formData.append('subheading', subHeading);
            formData.append('body', body);
            formData.append('tutorial_id', tutorial.id);

            if (files && files.length > 0) {
                files.forEach((file: File) => {
                    formData.append('files', file);
                });
            }

            dispatch(editTutorial({ id: tutorial.id, formData }));

            onClose();
        }
    };

    const handleFileChange = (e: any) => {
        const newFiles = Array.from(e.target.files);

        let newBody;
        if (textAreaRef.current) {
            //@ts-expect-error
            const cursorPosition = textAreaRef.current.selectionStart;
            newBody = body.slice(0, cursorPosition) + ' %s ' + body.slice(cursorPosition);
        } else {
            newBody = body + ' %s ';
        }

        setBody(newBody);
        //@ts-expect-error
        setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleDeleteAttachment = async (attachmentId: any) => {
        dispatch(deleteTutorialAttachments([attachmentId]))
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='edit-tutorial-title'
            aria-describedby='edit-tutorial-description'
            BackdropProps={{
                style: { backdropFilter: 'blur(5px)' },
            }}
        >
            <ModalBox>
                <Header>
                    <Typography variant='h6' sx={{ paddingLeft: '30px' }}>Edit Tutorial</Typography>
                    <PrimaryButton
                        onClick={onClose}
                        variant='filled'
                        height='31px'
                        width='30px'
                        fontSize='15px'
                        fontWeight='800'
                        backgroundColor='#DD6E70'
                        borderColor='#DD6E70'
                        icon={CloseIcon}
                        fontFamily='Roboto, sans-serif'
                        borderRadius={2}
                        style={{ marginRight: '10px', minWidth: '10px' }}
                    />
                </Header>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <PrimaryTextField
                            width='750px'
                            label='Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <PrimaryTextField
                            width='750px'
                            label='Sub-heading'
                            value={subHeading}
                            onChange={(e) => setSubHeading(e.target.value)}
                        />
                        <PrimaryTextField
                            ref={textAreaRef}
                            multiline
                            label='Body'
                            value={body.replace(/%s/g, '')}
                            setBody={setBody}
                            handleFileChange={handleFileChange}
                            width='750px'
                        />
                    </Box>
                    <Box>
                        <h4 style={{ margin: '3rem 1rem 1rem 1.5rem' }}>Attachments:</h4>
                        <ul style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', padding: 0 }}>
                            {tutorial && tutorial.tutorial_attachment?.map((file: any, index) => {
                                const filePath = file?.path;
                                const fileName = filePath?.split('/').pop();
                                const fileNameWithoutExt = fileName?.split('.').slice(0, -1).join('.');
                                const fileExt = fileName?.split('.').pop();

                                return (
                                    <Card key={index} sx={{ width: 160, backgroundColor: '#e3f2fd', boxShadow: 3, borderRadius: 2, position: 'relative', height: '45px' }}>
                                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', paddingBottom: '6px' }}>
                                            <a href={filePath} download={fileName} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <Typography variant='body2' noWrap sx={{ maxWidth: '120px' }}>
                                                    {fileNameWithoutExt && fileNameWithoutExt.length > 10 ? fileNameWithoutExt.slice(0, 10) + '...' : fileNameWithoutExt}.{fileExt}
                                                </Typography>
                                            </a>
                                            <IconButton size='small' onClick={() => handleDeleteAttachment(index)}>
                                                <CloseIcon fontSize='small' sx={{ color: '#dd6e70' }} />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </ul>

                        <ul
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                padding: 0,
                                listStyleType: 'none',
                            }}
                        >
                            {files && files?.map((file: any, index) => {
                                const fileName = file.name;
                                const fileExtension = fileName.split('.').pop();
                                const baseName = fileName.slice(0, fileName.lastIndexOf('.'));
                                const displayName = baseName.length > 7 ? `${baseName.slice(0, 7)}...` : baseName;
                                const fileUrl = URL.createObjectURL(file);

                                return (
                                    <Card
                                        key={index}
                                        sx={{
                                            width: 160,
                                            backgroundColor: '#e3f2fd',
                                            boxShadow: 3,
                                            borderRadius: 2,
                                            position: 'relative',
                                            height: '45px'
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                            }}
                                        >
                                            <Typography variant='body2' noWrap sx={{ maxWidth: '120px' }}>
                                                <a
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                >
                                                    {`${displayName}.${fileExtension}`}
                                                </a>
                                            </Typography>
                                            <IconButton
                                                size='small'
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <CloseIcon fontSize='small' sx={{ color: '#dd6e70' }} />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </ul>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <PrimaryButton variant='outlined' onClick={onClose} style={{ width: '144px' }}>
                            Cancel
                        </PrimaryButton>
                        <PrimaryButton type='submit' variant='filled' style={{ width: '120px' }}>
                            Save
                        </PrimaryButton>
                    </Box>
                </form>
            </ModalBox>
        </Modal>
    );
};

export default EditTutorial;
