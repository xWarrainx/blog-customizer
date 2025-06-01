import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import styles from './ArticleParamsForm.module.scss';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	OptionType,
	ArticleStateType,
} from '../../constants/articleProps';

type ArticleParamsFormProps = {
	setCurrentArticleState: (param: ArticleStateType) => void;
	currentArticleState: ArticleStateType;
};

export const ArticleParamsForm = ({
	currentArticleState,
	setCurrentArticleState,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const rootRef = useRef<HTMLDivElement>(null);

	// Локальное состояние формы (отдельно от состояния статьи)
	const [formState, setFormState] =
		useState<ArticleStateType>(currentArticleState);

	// Обработчик изменений в форме
	const handleChange = (key: keyof ArticleStateType, value: OptionType) => {
		setFormState((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	// Применить изменения (сохраняем в глобальное состояние)
	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentArticleState(formState);
	};

	// Сбросить форму (без сохранения в глобальное состояние)
	const handleResetForm = (e: React.FormEvent) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		setCurrentArticleState(defaultArticleState);
	};

	// Закрытие формы при клике вне ее области
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (
				isOpen &&
				rootRef.current &&
				!rootRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [isOpen, rootRef]);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			<aside
				ref={rootRef}
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleResetForm}>
					<Text size={45} weight={800}>
						ЗАДАЙТЕ ПАРАМЕТРЫ
					</Text>

					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(option) => handleChange('fontFamilyOption', option)}
						title='Шрифт'
					/>

					<Select
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(option) => handleChange('fontSizeOption', option)}
						title='Размер шрифта'
					/>

					<Select
						selected={formState.fontColor}
						options={fontColors}
						onChange={(option) => handleChange('fontColor', option)}
						title='Цвет шрифта'
					/>

					<Separator />

					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(option) => handleChange('backgroundColor', option)}
						title='Цвет фона'
					/>

					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(option) => handleChange('contentWidth', option)}
						title='Ширина контента'
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
