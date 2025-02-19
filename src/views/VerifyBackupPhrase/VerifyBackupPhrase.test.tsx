import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';

import { VerifyBackupPhrase } from './VerifyBackupPhrase';

const backupPhrase =
  'one two three four five six seven eight nine ten eleven twelve';

const backupPhraseWithDupeWord =
  'one two three four five six seven eight nine ten eleven two';

describe('VerifyBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(
      <VerifyBackupPhrase backupPhrase={backupPhrase} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should indicate the correct word', async () => {
    render(<VerifyBackupPhrase backupPhrase={backupPhrase} />);
    userEvent.click(await screen.findByRole('button', { name: 'one' }));
    expect(await screen.findByRole('button', { name: '01 one' })).toHaveClass(
      'correct',
    );
    expect(
      screen.queryByText('Please put every word in the correct order'),
    ).not.toBeInTheDocument();
  });

  it('should indicate the incorrect word', async () => {
    render(<VerifyBackupPhrase backupPhrase={backupPhrase} />);
    userEvent.click(await screen.findByRole('button', { name: 'seven' }));
    expect(
      (await screen.findAllByRole('button', { name: 'seven' }))[0],
    ).toHaveClass('incorrect');
    expect(
      await screen.findByText('Please put every word in the correct order'),
    ).toBeInTheDocument();
  });

  it('should handle selection of all words', async () => {
    const { container } = render(
      <VerifyBackupPhrase backupPhrase={backupPhrase} />,
    );
    userEvent.click(await screen.findByRole('button', { name: 'one' }));
    userEvent.click(await screen.findByRole('button', { name: 'two' }));
    userEvent.click(await screen.findByRole('button', { name: 'three' }));
    userEvent.click(await screen.findByRole('button', { name: 'four' }));
    userEvent.click(await screen.findByRole('button', { name: 'five' }));
    userEvent.click(await screen.findByRole('button', { name: 'six' }));
    userEvent.click(await screen.findByRole('button', { name: 'seven' }));
    userEvent.click(await screen.findByRole('button', { name: 'eight' }));
    userEvent.click(await screen.findByRole('button', { name: 'nine' }));
    userEvent.click(await screen.findByRole('button', { name: 'ten' }));
    userEvent.click(await screen.findByRole('button', { name: 'eleven' }));
    userEvent.click(await screen.findByRole('button', { name: 'twelve' }));

    expect(container).toMatchSnapshot();
  });

  it('should handle duplicate words', async () => {
    render(<VerifyBackupPhrase backupPhrase={backupPhraseWithDupeWord} />);
    userEvent.click((await screen.findAllByRole('button', { name: 'two' }))[0]);

    const buttons = await screen.findAllByRole('button', { name: 'two' });
    // button[0] is in the input field
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).not.toBeDisabled();
  });
});
