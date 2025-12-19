export type SearchItem = {
   contents_id: string;
   title: string;
   url: string;
   subject: string;
   teacher: string;
   year: number;
   type: 'past' | 'lecture';
   extensions: string[];
   likes: number;
};

export type SearchResultApi = {
   title: string;
   contents_id: string;
   subject_code: string;
   year: number;
   contents_type: 'past' | 'lecture';
   extensions: string;
   stars: number;
};

export type SubjectData = {
   id: string;
   code: string;
   name: string;
   place_and_time: string;
   teachers: string;
   url: string;
};
