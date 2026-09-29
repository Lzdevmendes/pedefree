/**
 * Obtém uma string de um FormData.
 * @param formData Dados do formulário
 * @param key Chave a ser buscada
 * @param options Opções para trim (padrão true) ou lowercase
 */
export function getString(formData: FormData, key: string, options?: { trim?: boolean; lowercase?: boolean }): string {
  const value = (formData.get(key) as string) || "";
  const trimmed = options?.trim !== false ? value.trim() : value;
  return options?.lowercase ? trimmed.toLowerCase() : trimmed;
}

/**
 * Obtém um número inteiro de um FormData.
 * @param formData Dados do formulário
 * @param key Chave a ser buscada
 * @param defaultValue Valor padrão caso o parsing falhe
 */
export function getNumber(formData: FormData, key: string, defaultValue?: number): number {
  const value = parseInt(getString(formData, key), 10);
  return isNaN(value) ? (defaultValue ?? 0) : value;
}

/**
 * Obtém um número de ponto flutuante de um FormData.
 * @param formData Dados do formulário
 * @param key Chave a ser buscada
 * @param defaultValue Valor padrão caso o parsing falhe
 */
export function getFloat(formData: FormData, key: string, defaultValue?: number): number {
  const value = parseFloat(getString(formData, key));
  return isNaN(value) ? (defaultValue ?? 0) : value;
}

/**
 * Obtém um valor booleano de um FormData (verifica se é 'on').
 * @param formData Dados do formulário
 * @param key Chave a ser buscada
 */
export function getBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

/**
 * Obtém um array de strings de um FormData, separando por um delimitador.
 * @param formData Dados do formulário
 * @param key Chave a ser buscada
 * @param separator Separador (padrão \n)
 */
export function getStringArray(formData: FormData, key: string, separator: string = "\n"): string[] {
  return getString(formData, key)
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Obtém uma Date de um FormData a partir de uma string.
 * @param formData Dados do formulário
 * @param key Chave a ser buscada
 */
export function getDate(formData: FormData, key: string): Date | undefined {
  const value = getString(formData, key);
  return value ? new Date(value) : undefined;
}
