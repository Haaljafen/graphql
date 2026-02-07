export const Q_USER_INFO = `
  query UserInfo {
    user {
      id
      login
      email
      firstName
      lastName
      auditRatio
      totalUp
      totalDown
      createdAt
      attrs
    }
  }
`;

export const Q_XP_TRANSACTIONS = `
  query XPTransactions {
    transaction(
      where: {
        type: { _eq: "xp" }
        _and: [
          { path: { _like: "%/bh-module/%" } }
          { path: { _nlike: "%/piscine-js/%" } }
        ]
      }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
      object {
        name
        type
      }
    }
  }
`;

export const Q_SKILLS = `
  query Skills {
    transaction(
      where: { type: { _like: "skill_%" } }
      order_by: { amount: desc }
    ) {
      type
      amount
    }
  }
`;

export const Q_RECENT_PROJECTS = `
  query RecentProjects {
    transaction(
      where: {
        type: { _eq: "xp" }
        _and: [
          { path: { _like: "%/bh-module/%" } }
          { path: { _nlike: "%/piscine-js/%" } }
        ]
      }
      order_by: { createdAt: desc }
      limit: 4
    ) {
      amount
      createdAt
      object {
        name
        type
      }
    }
  }
`;

export const Q_OBJECT_BY_ID = `
  query ObjectById($id: Int!) {
    object(where: { id: { _eq: $id } }) {
      id
      name
      type
    }
  }
`;

export const Q_PROGRESS = `
  query Progress {
    progress(
      where: {
        path: { _like: "%/bh-module/%" }
      }
    ) {
      objectId
      grade
      createdAt
      path
      object {
        name
      }
    }
  }
`;

export const Q_LEVEL = `
  query Level {
    transaction(
      where: { type: { _eq: "level" } }
      order_by: { amount: desc }
      limit: 1
    ) {
      amount
    }
  }
`;

export const Q_ROOT_EVENT_DETAILS = `
  query rootEventDetails($userId: Int!, $rootEventId: Int!) {
    xp: transaction_aggregate(
      where: {
        userId: { _eq: $userId }
        type: { _eq: "xp" }
        eventId: { _eq: $rootEventId }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    level: transaction(
      limit: 1
      order_by: { amount: desc }
      where: {
        userId: { _eq: $userId }
        type: { _eq: "level" }
        eventId: { _eq: $rootEventId }
      }
    ) {
      amount
    }
  }
`;
