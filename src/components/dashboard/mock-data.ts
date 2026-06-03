export const mockTodayTasks = [
  {
    id: '1',
    title: 'Review PRD document for Karsa v1',
    status: 'IN_PROGRESS' as const,
    priority: 'HIGH' as const,
    deadline: new Date(),
  },
  {
    id: '2',
    title: 'Set up NestJS auth module tests',
    status: 'TODO' as const,
    priority: 'MEDIUM' as const,
    deadline: new Date(Date.now() + 86400000),
  },
  {
    id: '3',
    title: 'Write landing page copy',
    status: 'DONE' as const,
    priority: 'LOW' as const,
    deadline: null,
  },
  {
    id: '4',
    title: 'Fix sidebar collapse bug',
    status: 'TODO' as const,
    priority: 'URGENT' as const,
    deadline: new Date(),
  },
];

export const mockTaskSummary = {
  total: 24,
  inProgress: 5,
  done: 11,
  overdue: 3,
};

export const mockDeadlines = [
  {
    id: '1',
    title: 'Submit capstone project',
    type: 'project',
    deadline: new Date(Date.now() - 86400000),
    priority: 'URGENT' as const,
  },
  {
    id: '2',
    title: 'Complete API documentation',
    type: 'task',
    deadline: new Date(),
    priority: 'HIGH' as const,
  },
  {
    id: '3',
    title: 'Portfolio website redesign',
    type: 'project',
    deadline: new Date(Date.now() + 86400000),
    priority: 'MEDIUM' as const,
  },
  {
    id: '4',
    title: 'Prepare presentation slides',
    type: 'task',
    deadline: new Date(Date.now() + 3 * 86400000),
    priority: 'HIGH' as const,
  },
  {
    id: '5',
    title: 'Internship report submission',
    type: 'task',
    deadline: new Date(Date.now() + 7 * 86400000),
    priority: 'MEDIUM' as const,
  },
];

export const mockProjects = [
  { id: '1', title: 'Karsa App', progress: 35, taskCount: 18, status: 'ACTIVE' },
  { id: '2', title: 'Portfolio 2026', progress: 60, taskCount: 9, status: 'ACTIVE' },
  { id: '3', title: 'Research Paper', progress: 20, taskCount: 12, status: 'ACTIVE' },
];

export const mockNotes = [
  {
    id: '1',
    title: 'Meeting notes — AI system design',
    updatedAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '2',
    title: 'Ideas for Karsa onboarding flow',
    updatedAt: new Date(Date.now() - 5 * 3600000),
  },
  {
    id: '3',
    title: 'Research: pgvector setup with Prisma',
    updatedAt: new Date(Date.now() - 24 * 3600000),
  },
  {
    id: '4',
    title: 'Book recommendations from mentor',
    updatedAt: new Date(Date.now() - 2 * 24 * 3600000),
  },
];
