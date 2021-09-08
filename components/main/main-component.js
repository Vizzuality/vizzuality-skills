import React, { useState, useEffect } from 'react';
import capitalize from 'lodash/capitalize';
import { SECTIONS as SECTIONS_2020, sectionCategories } from '../../data/sections-2020';
import { SECTIONS } from '../../data/sections-2021';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import ReactGA from 'react-ga';

import styles from '../../styles/Home.module.scss';

const Radar = dynamic(() => import('../radar/radar'));
const createAnalyticsEvent = ({ category, action }) => ReactGA.event({
  category,
  action
});

export default function Main(props) {
  const { uniqueSkills, groupedSkillsBySkill, categorySkills, skillData, source } = props;
  useEffect(() => {
    ReactGA.initialize('G-11M6FDTLKM');
  }, []);


  const [selectedCategory, selectCategory] = useState(null);
  const [selectedSection, selectSection] = useState(null);
  const [selectedSkill, selectSkill] = useState(null);

  const getFilteredSkills = (skills, section, category) => {
    let filteredSkills = skills;
    if (section) {
      filteredSkills = skills.filter(
        (skill) => sectionCategories[skill.category] === section
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

  const SkilledNames = ({ selectedSkill, value }) => {
    if (!selectedSkill || !groupedSkillsBySkill[selectedSkill]) return null;
    const valueSkills = groupedSkillsBySkill[selectedSkill].filter(
      (s) => s.value === value
    );
    if (!valueSkills) return null;
    return (
      <div className={styles.developerSkill}>
        <div className={styles.developerSkillTitle}>{capitalize(value)}</div>
        <div>
          {valueSkills.map((s) => (
            <div>{s.name}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategories = () => {
    const sections = source === '2020' ? SECTIONS_2020 : SECTIONS;
    const getCategories = (section) => (source === '2020' ?
      Object.keys(categorySkills).filter((category) => sectionCategories[category] === section) :
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
      <div className={styles.sections}>
        {categorySkills && renderCategories()}
      </div>
      <Radar
        width={800}
        height={800}
        data={skillData}
        skills={filteredSkills}
        isUnfiltered={!selectedSection && !selectedCategory}
      />
      <div className={styles.skillSection}>
        <label for="skill" className={styles.skillLabel}>
          Choose a skill
        </label>
        <input
          list="skills"
          name="skill"
          id="skill"
          onChange={(v) => {
            const skill = v.target.value;
            if (uniqueSkills.map((s) => s.skill).includes(skill)) {
              createAnalyticsEvent({ category: 'Skill', action: skill });
            }
            selectSkill(skill);
          }}
        />
        <datalist id="skills">
          {uniqueSkills
            .map((s) => s.skill)
            .map((skill) => (
              <option value={skill} />
            ))}
        </datalist>
      </div>
      <div className={styles.skillNames}>
        <SkilledNames selectedSkill={selectedSkill} value={'expert'} />
        <SkilledNames selectedSkill={selectedSkill} value={'competent'} />
        <SkilledNames selectedSkill={selectedSkill} value={'basic knowledge'} />
        <SkilledNames selectedSkill={selectedSkill} value={'no knowledge'} />
        <SkilledNames selectedSkill={selectedSkill} value={'learning'} />
        <SkilledNames selectedSkill={selectedSkill} value={'want to learn'} />
        <SkilledNames selectedSkill={selectedSkill} value={'not interested'} />
      </div>
    </main>
  );
}