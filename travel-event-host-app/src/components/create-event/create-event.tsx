'use client';
import Category from '@/lib/category';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import CategoryDict from '@/lib/categoryArray';
import { Checkbox, FormControlLabel } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import CommonButton from '@/components/common-button/Common-Button';
import { useTheme } from '@mui/material';
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';

interface DateSelection {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}
const ErrorLabel = ({
  fieldname,
  errors,
}: {
  fieldname: string;
  errors: Record<string, string[]>;
}) => {
  if (fieldname in errors) {
    return <p className={styles.errorLabel}>{errors[fieldname][0]}</p>;
  }
  return null;
};

interface MyComponentProps {
  setDate: (dateSelection: DateSelection[]) => void;
}
const MyComponent: React.FC<MyComponentProps> = ({ setDate }) => {
  const [state, setState] = useState<DateSelection[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  return (
    <DateRange
      editableDateInputs={true}
      onChange={(item) => {
        setState([item.selection] as DateSelection[]);
        setDate([item.selection] as DateSelection[]);
      }}
      moveRangeOnFirstSelection={false}
      ranges={state}
      minDate={new Date()}
    />
  );
};

const updateCategories = () => {
  let updateCategories: { [key in string]: boolean } = {};

  Object.values(Category).map((category: string) => (updateCategories[category] = false));

  return updateCategories;
};

export default function CreateEvent() {
  const theme = useTheme();
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<DateSelection[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [eventImg, setEventImg] = useState<File | null>(null);
  const [categoryCheckboxState, setCategoryCheckboxState] = useState<{ [key in string]: boolean }>(
    {},
  );

  useEffect(() => {
    setCategoryCheckboxState(updateCategories());
  }, []);
  const handleCategoryChange = (event: { target: { name: any; checked: any } }) => {
    setCategoryCheckboxState({
      ...categoryCheckboxState,
      [event.target.name]: event.target.checked,
    });
  };
  const removeSelectedImage = () => {
    let fileInput = document.getElementById('file');

    if (fileInput instanceof HTMLInputElement) {
      fileInput.value = '';
      fileInput.dispatchEvent(new Event('change'));
    }

    setEventImg(null);
  };
  const submitEvent = () => {
    const errorsNow: { [key: string]: string[] } = {};

    if (title === '') {
      errorsNow.title = [...(errorsNow.title || []), "Title can't be empty"];
    }
    if (description === '') {
      errorsNow.description = [...(errorsNow.description || []), "Description can't be empty"];
    }
    if (eventImg === null) {
      errorsNow.eventImg = [...(errorsNow.eventImg || []), 'Event required image'];
    }
    if (!Object.values(categoryCheckboxState).includes(true)) {
      errorsNow.categories = [...(errorsNow.categories || []), 'Event needs at least 1 category'];
    }
    if (Object.values(errorsNow).length < 0) {
      // Create Event
    }
    setErrors(errorsNow);
  };
  return (
    <main className={styles.main}>
      <h2>Create Event</h2>
      <section className={styles.mainSection}>
        <div className={styles.twoDivContainer}>
          <div className={styles.photoLeftBox}>
            <div className={styles.titleBox}>
              <label className={styles.label} htmlFor='title'>
                Title
                <ErrorLabel fieldname='title' errors={errors} />
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Event Title'
                id='title'
                type='text'
              ></input>
            </div>
            <div>
              <label className={styles.label} htmlFor='description'>
                Description <ErrorLabel fieldname='description' errors={errors} />
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Event Description'
                id='description'
              ></textarea>
            </div>
          </div>
          <div>
            <label className={styles.label}>
              <ErrorLabel fieldname='eventImg' errors={errors} />
            </label>
            <div className={`${styles.eventPhotoBox} ${eventImg ? '' : 'cursor-pointer'}`}>
              {eventImg ? (
                <div className='relative h-full'>
                  <Image
                    className='w-full h-full object-cover'
                    src={URL.createObjectURL(eventImg)}
                    alt='Event Image'
                    width={500} // Agrega el ancho de la imagen
                    height={300} // Agrega la altura de la imagen
                  />
                  <div className='relative w-full'>
                    <div
                      onClick={removeSelectedImage}
                      className='cursor-pointer p-[.5rem] rounded-[50%] absolute flex justify-center items-center right-[15px] bottom-[15px] w-[3rem] h-[3rem] bg-red-500'
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <label className={styles.labelEventImage} htmlFor='eventPhoto'></label>
                  <FileUploadIcon sx={{ fontSize: '4em', color: '#70b0db' }} />
                  <p>Click here to upload event photo</p>
                  <p>PNG, JPG or GIF(MAX. 800x400px)</p>
                </>
              )}
            </div>
            <input
              className={styles.inputEventPhoto}
              type='file'
              name='eventPhoto'
              id='eventPhoto'
              onChange={(e) => setEventImg(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <div className={styles.twoDivContainer}>
          <div className={styles.categoryBox}>
            <label className={styles.label}>
              Category <ErrorLabel fieldname='categories' errors={errors} />
            </label>
            <div className={styles.categoriesCheckBox}>
              {Object.entries(categoryCheckboxState).map(([category, checked]) => (
                <FormControlLabel
                  sx={{ color: 'black', textWrap: 'nowrap' }}
                  key={category}
                  control={
                    <Checkbox checked={checked} onChange={handleCategoryChange} name={category} />
                  }
                  label={CategoryDict[category as Category]}
                />
              ))}
            </div>
          </div>
          <div className={styles.dateBox}>
            <label className={styles.label}>Date</label>
            <MyComponent setDate={setDate} />
          </div>
        </div>
        <CommonButton
          onButtonClick={submitEvent}
          label='Create Event'
          textColor={theme.palette.primary.thirdColorIceLight}
          backgroundColor={theme.palette.primary.primaryColorDarkBlue}
          borderColor={theme.palette.primary.thirdColorIceLight}
          additionalStyles={{
            margin: 'auto',
            padding: '15px 30px',
            minWidth: '302px',
            fontSize: '1rem',
            [theme.breakpoints.down(880)]: { minWidth: 0, padding: '5px 20px' },
            [theme.breakpoints.down(720)]: {
              '&.MuiButtonBase-root': {
                fontWeight: '400',
              },
            },
          }}
        />
      </section>
    </main>
  );
}
