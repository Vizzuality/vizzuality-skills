import React, { useState, useEffect } from 'react';
import { SECTIONS as SECTIONS_2020, sectionCategories } from '../../data/sections-2020';
import { SECTIONS } from '../../data/sections-2021';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link'
import ReactGA from 'react-ga';
import homeStyles from '../../styles/Home.module.scss';
import devMainStyles from './dev-main.module.scss';

const styles = {...homeStyles, ...devMainStyles};
const Radar = dynamic(() => import('../radar/radar'));
const Card = dynamic(() => import('../card/card'), { ssr: false });

const createAnalyticsEvent = ({ category, action }) => ReactGA.event({
  category,
  action
});

export default function Main(props) {
  const { uniqueSkills, categorySkills, skillData, interestData, is2020, developers, config, dev } = props;
  const {
    skillRanges,
    colors,
    interestColors
  } = config;

  const updatedSectionCategories = sectionCategories;
  if (!is2020) {
    Object.entries(SECTIONS).forEach(([section, categories]) => {
      updatedSectionCategories[section] = Object.keys(categories);
    });
  }

  useEffect(() => {
    ReactGA.initialize('G-11M6FDTLKM');
  }, []);

  const [selectedCategory, selectCategory] = useState(null);
  const [selectedSection, selectSection] = useState(null);

  const getFilteredSkills = (skills, section, category) => {
    let filteredSkills = skills;
    if (section) {
      filteredSkills = skills.filter(
        (skill) => skill.category && updatedSectionCategories[skill.category.toLowerCase()] === section
      );
    }
    if (category) {
      filteredSkills = skills.filter((skill) => skill.category === category);
    }
    return filteredSkills;
  };

  const filteredSkills = getFilteredSkills(
    uniqueSkills,
    selectedSection,
    selectedCategory
  );


  const renderCategories = () => {
    const sections = is2020 ? SECTIONS_2020 : SECTIONS;
    const getCategories = (section) => (is2020 ?
      Object.keys(categorySkills).filter((category) => updatedSectionCategories[category] === section) :
      Object.keys(sections[section])
    );
    return sections && Object.keys(sections).map((section) => (
      <div className={cx(styles.section, styles[section])}>
        <button
          className={cx(styles.sectionTitle, {
            [styles.blue]: section === selectedSection
          })}
          onClick={() => {
            createAnalyticsEvent({
              category: 'Section',
              action: section
            });
            selectSection(selectedSection === section ? null : section);
          }}
        >
          {section}
        </button>
        <div className={styles.categories}>
          {getCategories(section)
            .map((category) => (
              <button
                className={cx({
                  [styles.blue]: category === selectedCategory
                })}
                onClick={() => {
                  createAnalyticsEvent({
                    category: 'Category',
                    action: category
                  });
                  selectCategory(
                    selectedCategory === category ? null : category
                  );
                }}
              >
                {category}
              </button>
            ))}
        </div>
      </div>
    ));
  };

  return (
    <main>
      <div className={styles.devCardContainer}>
        <Card dev={dev} className={styles.devCard}/>
      </div>
      <ul className={styles.devLinks}>{developers.map(dev => <li>
        <Link href={`/devs/${dev}`}>
          <a className={styles.devLink}>{dev}</a>
        </Link>
      </li>)}</ul>
      <div className={styles.sections}>
        {categorySkills && renderCategories()}
      </div>
      <Radar
        width={800}
        height={800}
        data={skillData}
        skills={filteredSkills}
        skillRanges={skillRanges}
        isUnfiltered={!selectedSection && !selectedCategory}
        colors={colors}
        domain={is2020 ? [0, 1] : [0, 4]}
      />
      {!is2020 && (
        <Radar
          width={800}
          height={800}
          data={interestData}
          skills={filteredSkills}
          skillRanges={[
            'interested',
            'not interested'
          ]}
          isUnfiltered={!selectedSection && !selectedCategory}
          colors={interestColors}
          domain={[0, 1]}
        />
      )}
    </main>
  );
}