interface RoleGroup {
    name: string
    items: string[]
}

const roles : RoleGroup[] = [
    {
        name: 'General',
        items: [
            'Founder',
            'Collaborator',
        ]
    },
    {
        name: 'Game Design',
        items: [
            'Game Designer',
            'Level Designer',
            'Narrative Designer',
            'Quest Designer / Mission Designer',
            'Systems Designer',
            'UX Designer',
            'UI Designer',
            'Game Balancer / Tuner',
            'Creative Director',
            'Lead Designer'
        ]
    },
    {
        name: 'Engineering / Programming',
        items: [
            'Gameplay Programmer',
            'Engine Programmer',
            'Graphics Programmer',
            'AI Programmer',
            'Physics Programmer',
            'Network / Multiplayer Programmer',
            'Tools Programmer',
            'UI Programmer',
            'Audio Programmer',
            'Build Engineer / DevOps Engineer',
            'Technical Director',
            'Lead Engineer'
        ]
    },
    {
        name: 'Art Department',
        items: [
            'Concept Artist',
            'Character Artist',
            'Environment Artist',
            'Prop Artist',
            'Texture / Material Artist',
            'Animator',
            'Technical Artist',
            'Lighting Artist',
            'VFX Artist',
            'UI Artist',
            'Art Director',
            'Lead Artist'
        ]
    },
    {
        name: 'Audio Department',
        items: [
            'Sound Designer',
            'Composer',
            'Audio Engineer',
            'Voice Director',
            'Voice Actor / Performer',
            'Audio Implementer',
            'Technical Sound Designer',
            'Audio Director'
        ]
    },
    {
        name: 'Writing / Narrative',
        items: [
            'Lead Writer',
            'Scriptwriter / Dialogue Writer',
            'Narrative Designer',
            'Localization Writer / Translator',
            'Editor / Narrative QA'
        ]
    },
    {
        name: 'Quality Assurance',
        items: [
            'QA Tester',
            'Game Tester',
            'QA Lead',
            'Automation Tester',
            'QA Engineer',
            'Compliance Tester',
            'Playtester',
            'User Researcher',
        ]
    },
    {
        name: 'Production / Management',
        items: [
            'Producer',
            'Project Manager',
            'Associate Producer',
            'Executive Producer',
            'Scrum Master / Agile Coach',
            'Product Manager',
            'Studio Head',
            'General Manager'
        ]
    },
    {
        name: 'Marketing & Community',
        items: [
            'Market Manager',
            'Community Manager',
            'Social Media Manager',
            'PR Manager',
            'Communication Specialist',
            'Influencer',
            'Partnerships Manager',
            'Content Creator',
            'Video Editor',
            'Brand Manager'
        ]
    },
    {
        name: 'Business & Operations',
        items: [
            'Business Development Manager',
            'Monetization Designer / Analyst',
            'Finance Manager / Accountant',
            'Legal Counsel',
            'HR Manager',
            'Recruiter',
            'IT Support',
            'System Administrator'
        ]
    },
    {
        name: 'Support & Post-Launch',
        items: [
            'Live Operations Manager',
            'Customer Support / Player Support',
            'Data Analyst / Telemetry Engineer',
            'Community QA / Moderation'
        ]
    }
]

export default roles

export type { RoleGroup }