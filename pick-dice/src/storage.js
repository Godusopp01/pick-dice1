const KEY = 'pig-settings-v1';

export const saveSettings = (settings) => {
  localStorage.setItem(KEY, JSON.stringify(settings));
};

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};


export const History = {
  // add(result), list(n), clear(), exportCSV(), exportJSON(), importData()
};