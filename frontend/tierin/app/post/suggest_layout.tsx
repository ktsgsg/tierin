"use client";

import { useEffect, useState } from "react";
import { getSubjectsCode } from "@/app/components/suggest";
import styles from './suggest_layout.module.css';

type SuggestProps = {
  value?: string;
  onChange?: (value: string) => void;
};

type TeacherInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

type SubjectData = {
  id: string;
  code: string;
  name: string;
  place_and_time: string;
  teachers: string;
  url: string;
};

// SubjectSuggestInput と授業一覧表示を管理するコンテナ
export function SubjectTeacherContainer() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [subjectResults, setSubjectResults] = useState<SubjectData[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 科目または先生が入力されたら、該当授業一覧を取得
  useEffect(() => {
    if (!selectedSubject.trim() && !selectedTeacher.trim()) {
      setSubjectResults([]);
      setSelectedCode("");
      return;
    }

    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const results = await getSubjectsCode({
          name: selectedSubject,
          teacher: selectedTeacher
        });
        setSubjectResults(results);
        setSelectedCode(""); // 検索結果が変わったら選択をリセット
      } catch (err) {
        console.error("Failed to fetch subjects", err);
        setSubjectResults([]);
        setSelectedCode("");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSubjects, 250);
    return () => clearTimeout(timer);
  }, [selectedSubject, selectedTeacher]);

  return {
    SubjectInputs: (
      <>
        <SubjectSuggestInput
          value={selectedSubject}
          onChange={(v) => setSelectedSubject(v)}
        />
        <TeacherInput
          value={selectedTeacher}
          onChange={(v) => setSelectedTeacher(v)}
          disabled={!selectedSubject.trim()}
        />
      </>
    ),
    SubjectList: (
      <>
        {(selectedSubject.trim() || selectedTeacher.trim()) ? (
          <>
            <h3 className={styles.subjectListTitle}>
              該当授業一覧
            </h3>
            {loading ? (
              <div className={styles.loadingText}>読み込み中...</div>
            ) : subjectResults.length > 0 ? (
              <div className={styles.subjectListContainer}>
                {subjectResults.map((subject, index) => (
                  <label
                    key={subject.id}
                    className={`${styles.subjectCard} ${selectedCode === subject.code ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="subject_code"
                      value={subject.code}
                      checked={selectedCode === subject.code}
                      onChange={(e) => setSelectedCode(e.target.value)}
                      required={index === 0}
                      className={styles.subjectCardRadio}
                    />
                    <div>
                      <div className={styles.subjectName}>
                        {subject.code} - {subject.name}
                      </div>
                      <div className={styles.subjectTeacher}>
                        担当: {subject.teachers}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className={styles.emptyText}>該当する授業がありません</div>
            )}
          </>
        ) : (
          <div className={styles.emptyText}>科目名または先生を入力してください</div>
        )}
      </>
    )
  };
}

export function SubjectSuggestInput({ value, onChange }: SuggestProps) {
  const [subjectValue, setSubjectValue] = useState(value ?? "");

  // 親からのvalue更新に追従
  useEffect(() => {
    if (value !== undefined && value !== subjectValue) {
      setSubjectValue(value);
    }
  }, [value, subjectValue]);

  return (
    <div>
      <label htmlFor="subject_search" className="auth-label">
        科目名
      </label>
      <input
        type="text"
        id="subject_search"
        placeholder="例：微分積分"
        value={subjectValue}
        onChange={(e) => {
          const v = e.target.value;
          setSubjectValue(v);
          onChange?.(v);
        }}
        className="auth-input"
      />
    </div>
  );
}

export function TeacherInput({ value, onChange, disabled = false }: TeacherInputProps) {
  const [teacherValue, setTeacherValue] = useState(value ?? "");

  // 親からのvalue更新に追従
  useEffect(() => {
    if (value !== undefined && value !== teacherValue) {
      setTeacherValue(value);
    }
  }, [value, teacherValue]);

  return (
    <div>
      <label htmlFor="teacher_search" className="auth-label">
        先生
      </label>
      <input
        type="text"
        id="teacher_search"
        placeholder="例：山田 太郎"
        value={teacherValue}
        onChange={(e) => {
          const v = e.target.value;
          setTeacherValue(v);
          onChange?.(v);
        }}
        disabled={disabled}
        className="auth-input"
        style={{ cursor: disabled ? 'not-allowed' : 'text' }}
      />
    </div>
  );
}
