interface Permission {
    label: string
    value: string
}

const permissions: {
    [group: string]: Permission[]
} = {
    Ideas: [
        {
            label: 'Create ideas',
            value: 'create-posts'
        },
        {
            label: 'Edit ideas',
            value: 'edit-posts'
        },
        {
            label: 'Delete ideas',
            value: 'delete-posts'
        },
    ],
    Team: [
        {
            label: 'Edit team info',
            value: 'edit-info'
        },
        {
            label: 'Transfer team',
            value: 'transfer'
        },
    ],
    Members: [
        {
            label: 'Add members',
            value: 'add-member'
        },
        {
            label: 'Remove members',
            value: 'delete-member'
        },
        {
            label: 'Edit role',
            value: 'edit-role'
        },
    ],
    Projects: [
        {
            label: 'Create projects',
            value: 'create-project'
        },
        {
            label: 'Edit projects',
            value: 'edit-project'
        },
        {
            label: 'Delete projects',
            value: 'delete-project'
        },
        {
            label: 'Add members',
            value: 'add-project-member'
        },
    ],
    Opportunities: [
        {
            label: 'Create opportunities',
            value: 'create-jobs'
        },
        {
            label: 'Edit opportunities',
            value: 'edit-jobs'
        },
        {
            label: 'Delete opportunities',
            value: 'delete-jobs'
        },
    ]
}

export default permissions

export type { Permission }