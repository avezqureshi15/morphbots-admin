import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, IconButton, Modal, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import PrimaryTextField from '../../../components/custom/PrimaryTextField';
import PrimaryButton from '../../../components/custom/PrimaryButton';
import { styled } from '@mui/system';
import { Chapter, deleteChapterAttachments, editChapter } from '../../../slices/curriculumSlice';
import { useAppDispatch } from '../../../hooks/redux-hook';

interface EditChapterProps {
    open: boolean;
    onClose: () => void;
    chapter: Chapter | null; // Added chapter prop
    onSave: (chapter: Chapter) => void; // Added onSave callback
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

const EditChapter: React.FC<EditChapterProps> = ({ open, onClose, chapter }) => {
    const [title, setTitle] = useState('');
    const [subHeading, setSubHeading] = useState('');
    const [body, setBody] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const dispatch = useAppDispatch();
    const textAreaRef = useRef(null);
    useEffect(() => {
        if (chapter) {
            setTitle(chapter.title);
            setSubHeading(chapter.subheading);
            setBody(chapter.body);
            //@ts-expect-error
            setFiles(chapter.files || []);
        }
    }, [chapter]);

    // const handleSave = () => {
    //     if (chapter) {
    //         const updatedChapter = { ...chapter, title, subheading, body };
    //         onSave(updatedChapter);
    //     }
    //     onClose();
    // };

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


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (chapter) {
            const formData = new FormData();
            console.log(chapter);
            formData.append('title', title);
            formData.append('subheading', subHeading);
            formData.append('body', body);
            formData.append('tutorial_id', chapter.tutorial_id);

            if (files && files.length > 0) {
                files.forEach((file: File) => {
                    formData.append('files', file);
                });
            }

            dispatch(editChapter({ id: chapter.id, formData }));

            onClose();
        }
    };


    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleDeleteAttachment = async (attachmentId: any) => {
        dispatch(deleteChapterAttachments([attachmentId]))
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='edit-chapter-title'
            aria-describedby='edit-chapter-description'
            BackdropProps={{
                style: {
                    backdropFilter: 'blur(5px)',
                },
            }}
        >
            <ModalBox>
                <Header>
                    <Typography variant='h6' sx={{ paddingLeft: '30px' }} >Edit Chapter</Typography>
                    <PrimaryButton onClick={onClose} variant='filled' height='31px' width='30px' fontSize='15px' fontWeight='800' backgroundColor='#DD6E70' borderColor='#DD6E70' icon={CloseIcon} fontFamily='Roboto, sans-serif' borderRadius={2} style={{ marginRight: '10px', minWidth: '10px' }} ></PrimaryButton>
                </Header>
                <form onSubmit={handleSubmit}  >
                    <Box
                        component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}
                    >
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
                            multiline
                            ref={textAreaRef}
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
                            {chapter && chapter.chapter_attachment?.map((file: any, index) => {
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
                    <Box
                        component='div'
                        sx={{
                            width: '777px',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'end',
                            flexDirection: 'row',
                            marginTop: '4rem'
                        }}
                    >
                        <PrimaryButton onClick={onClose} variant='outlined' height='38px' width='144px' fontWeight='600' fontSize='13px' backgroundColor='#fff' borderColor='#000' textColor='#000' border='1' style={{ marginRight: '7px' }} >Cancel</PrimaryButton>
                        <PrimaryButton type='submit' variant='filled' height='38px' width='120px' fontWeight='600' fontSize='13px'  >Save</PrimaryButton>
                    </Box>
                </form>
            </ModalBox>
        </Modal>
    );
};

export default EditChapter;