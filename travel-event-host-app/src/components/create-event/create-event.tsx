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
const MyComponent = () => {
  const [state, setState] = useState<
    {
      startDate: undefined | Date;
      endDate: undefined | Date;
      key: string;
    }[]
  >([
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
        setState([item.selection] as {
          startDate: undefined | Date;
          endDate: undefined | Date;
          key: string;
        }[]);
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

  const submitEvent = () => {};
  return (
    <main className={styles.main}>
      <h2>Create Event</h2>
      <section className={styles.mainSection}>
        <div className={styles.twoDivContainer}>
          <div className={styles.photoLeftBox}>
            <div className={styles.titleBox}>
              <label htmlFor='title'>Title</label>
              <ErrorLabel fieldname='title' errors={errors} />
              <input placeholder='Event Title' id='title' type='text'></input>
            </div>
            <div>
              <label htmlFor='description'>Description</label>
              <textarea placeholder='Event Description' id='description'></textarea>
            </div>
          </div>
          <div className={styles.eventPhotoBox}>
            <FileUploadIcon sx={{ fontSize: '4em', color: '#70b0db' }} />
            <p>Click here to upload event photo</p>
            <p>PNG, JPG or GIF(MAX. 800x400px)</p>
          </div>
        </div>
        <div className={styles.twoDivContainer}>
          <div className={styles.categoryBox}>
            <label>Category</label>
            <div className={styles.categoriesCheckBox}>
              {Object.entries(categoryCheckboxState).map(([category, checked]) => (
                <FormControlLabel
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
            <label>Date</label>
            <MyComponent />
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
