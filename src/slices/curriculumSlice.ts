import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { URLS } from "../constants/urlConstants";
import ErrorResponse, { handleApiError } from "../utils/errorUtils";
import { toast } from "react-toastify";

export interface Chapter {
    id: string;
    title: string;
    subheading: string;
    body: string;
    files: string[];
    tutorial_id: string;
    chapter_attachment: []
}


export interface Tutorial {
    id: string;
    title: string;
    subheading: string;
    body: string;
    files: string[];
    chapters: Chapter[];
    tutorial_attachment: []
}

interface TutorialState {
    tutorials: Tutorial[];
    loading: boolean;
    error: string | null;
    success: boolean;
    chapters: Chapter[];
}

const initialState: TutorialState = {
    tutorials: [],
    loading: false,
    error: null,
    success: false,
    chapters: []
};

export const createTutorial = createAsyncThunk(
    "tutorial/create",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(URLS.CREATE_TUTORIAL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Tutorial Added Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000)
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);

export const getTutorials = createAsyncThunk(
    "tutorial/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(URLS.GET_TUTORIALS);
            return response.data.data;
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);

export const editTutorial = createAsyncThunk(
    "tutorial/edit",
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
        console.log(formData)
        try {
            const response = await axiosInstance.put(URLS.EDIT_TUTORIAL(id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Tutorial Updated Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);

export const deleteTutorial = createAsyncThunk(
    "tutorial/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(URLS.DELETE_TUTORIAL(id), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Tutorial Deleted Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000)
            return { id, message: response.data.message }; // Return the ID and success message
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);

export const deleteTutorialAttachments = createAsyncThunk(
    "tutorial-attachments/delete",
    async (attachmentIds: string[], { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(URLS.DELETE_TUTORIAL_ATTACHMENT, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                data: { attachment_ids: attachmentIds },
            });
            toast.success("Attachments Deleted Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            return { attachmentIds, message: response.data.message };
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);

export const deleteChapterAttachments = createAsyncThunk(
    "chapter-attachments/delete",
    async (attachmentIds: string[], { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(URLS.DELETE_CHAPTER_ATTACHMENT, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                data: { attachment_ids: attachmentIds },
            });
            toast.success("Attachments Deleted Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            return { attachmentIds, message: response.data.message };
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);



export const createChapter = createAsyncThunk(
    "chapter/create",
    async (formData: FormData, { rejectWithValue }) => {
        console.log(formData)
        try {
            const response = await axiosInstance.post(URLS.CREATE_CHAPTER, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Chapter Added Successfully");
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000)
            return response.data; // Ensure the response includes the tutorial ID and chapter data

        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);

export const getChapters = createAsyncThunk(
    "chapter/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(URLS.GET_CHAPTERS);
            console.log(response);
            return response.data; // Assuming the API returns an array of chapters
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);


export const editChapter = createAsyncThunk(
    "chapter/edit",
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(URLS.EDIT_CHAPTER(id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Chapter Updated Successfully");
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000)
            return response.data; // Return updated chapter data
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);

export const deleteChapter = createAsyncThunk(
    "chapter/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(URLS.DELETE_CHAPTER(id), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Chapter Deleted Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000)
            return { id, message: response.data.message }; // Return the ID and success message
        } catch (error) {
            const apiError = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiError);
        }
    }
);




const tutorialSlice = createSlice({
    name: "tutorial",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTutorial.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createTutorial.fulfilled, (state, action: PayloadAction<Tutorial>) => {
                state.loading = false;
                state.success = true;
                state.tutorials.push(action.payload);
            })
            .addCase(createTutorial.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(getTutorials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTutorials.fulfilled, (state, action: PayloadAction<Tutorial[]>) => {
                state.loading = false;
                state.tutorials = action.payload;
            })
            .addCase(getTutorials.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editTutorial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editTutorial.fulfilled, (state, action: PayloadAction<Tutorial>) => {
                state.loading = false;
                state.success = true;
                const updatedTutorials = state.tutorials.map((tutorial) =>
                    tutorial.id === action.payload.id ? action.payload : tutorial
                );
                state.tutorials = updatedTutorials;
            })
            .addCase(editTutorial.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteTutorial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTutorial.fulfilled, (state, action: PayloadAction<{ id: string; message: string }>) => {
                state.loading = false;
                state.success = true;
                state.tutorials = state.tutorials.filter((tutorial) => tutorial.id !== action.payload.id);
            })
            .addCase(deleteTutorial.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createChapter.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createChapter.fulfilled, (state, action: PayloadAction<Chapter>) => {
                state.loading = false;
                state.success = true;
                const tutorialIndex = state.tutorials.findIndex(t => t.id === action.payload.tutorial_id);
                if (tutorialIndex !== -1) {
                    state.tutorials[tutorialIndex].chapters.push(action.payload);
                }
            })
            .addCase(createChapter.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(getChapters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChapters.fulfilled, (state, action: PayloadAction<Chapter[]>) => {
                state.loading = false;
                state.chapters = action.payload;
            })
            .addCase(getChapters.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editChapter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editChapter.fulfilled, (state, action: PayloadAction<Chapter>) => {
                state.loading = false;
                state.success = true;
                const updatedTutorials = state.tutorials.map((tutorial) => {
                    if (tutorial.id === action.payload.tutorial_id) {
                        const updatedChapters = tutorial.chapters.map((chapter) =>
                            chapter.id === action.payload.id ? action.payload : chapter
                        );
                        return { ...tutorial, chapters: updatedChapters };
                    }
                    return tutorial;
                });
                state.tutorials = updatedTutorials;
            })
            .addCase(editChapter.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteChapter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteChapter.fulfilled, (state, action: PayloadAction<{ id: string; message: string }>) => {
                state.loading = false;
                state.success = true;
                const updatedTutorials = state.tutorials.map((tutorial) => {
                    const updatedChapters = tutorial.chapters.filter(chapter => chapter.id !== action.payload.id);
                    return { ...tutorial, chapters: updatedChapters };
                });
                state.tutorials = updatedTutorials;
            })
            .addCase(deleteChapter.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default tutorialSlice.reducer;
